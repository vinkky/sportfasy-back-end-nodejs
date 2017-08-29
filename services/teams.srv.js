module.exports = function (teams) {

    let TournamentTeams = require('../models/tournament_teams');

    let TeamsService = function (teams) {
        this.teams = new Array;
        this.populateQuery = [{path: '_team', populate: [{path: '_players'},{path: '_team_master'}]},{path: '_tournament'}];
    }

    TeamsService.prototype.addPosition = function (tournaments) {
            tournaments.forEach(tournament=>{
                tournament._teams.forEach((team, arrIndex) => {
                    team.position = arrIndex + 1;
                    team._tournament = tournament._id;
                    team.team_total += tournament._tournament[0].budget;
                    team.trnmt_end_date = tournament._tournament[0].end;
                    this.teams.push(team);
                })
            });
        return this;
    }

    TeamsService.prototype.getTargetTeams = function (query) {
        if (query.team_ids.length !== 0) {
            this.teams = this.teams.filter((team) => {
                if (query.team_ids.indexOf(team._team_master.toString()) !== -1) {
                    // console.log("target: " + team);
                    return team;
                }
            })
        }
        return this;
    }

    TeamsService.prototype.getTeamsOfEndedTournaments = function(query){

        if (query.ended_tournaments) {
            // console.log("date target: " + this.teams[0].trnmt_end_date);
            this.teams = this.teams.filter((team) => {
                if (team.trnmt_end_date.valueOf() < new Date().valueOf()) {
                    return team;
                }
            })
        }
        return this;
    }

    TeamsService.prototype.populateTeamsAndResponse = function (res) {
        TournamentTeams.populate(
            this.teams, this.populateQuery, function (err, results) {
                if (err) throw err;
                // console.log(JSON.stringify(results, undefined, 2));
                console.log('good');
                return res.send(results);
            });
    }


    TeamsService.prototype.getTeamsTotal = function (query, res) {
        that = this;
        TournamentTeams.aggregate([
                {
                    $lookup: {
                        from: "playersledgers",
                        localField: "_team",
                        foreignField: "_team",
                        as: "_team_ledger"
                    }
                },
                {
                    $unwind: {
                        path: "$_team_ledger",
                        "preserveNullAndEmptyArrays": true
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        _team: {$first: "$_team"},
                        _team_master: {$first:"$_team_master"},
                        _tournament: {$first: "$_tournament"},
                        team_total: {$sum: "$_team_ledger._total_income"},
                    }
                },
                {
                    $group: {
                        _id: {
                            _team: "$_team",
                            team_total: "$team_total",
                            _team_master:"$_team_master",
                        },
                        doc_id: {$first:  "$_tournament" },
                    }
                },
                {$sort: { "_id.team_total": -1,}},
                {
                    $group: {
                        _id: "$doc_id",
                        _teams: {
                            $push: {
                                _team: "$_id._team",
                                team_total: "$_id.team_total",
                                _team_master:"$_id._team_master",
                            },
                        },

                    }
                },
                {
                    $lookup: {
                        from: "tournaments",
                        localField: "_id",
                        foreignField: "_id",
                        as: "_tournament"
                    }
                },
            ],
            function (err, tournaments) {
                if (err) {
                    console.log('error grouping teams in Player Ledger ');
                } else {
                    console.log('query'+JSON.stringify(query,null,2));
                    that.addPosition(tournaments).getTargetTeams(query).getTeamsOfEndedTournaments(query).populateTeamsAndResponse(res);
                }
            });
    }
    return TeamsService;
}