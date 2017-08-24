module.exports = function (teams) {

    let TournamentTeams = require('../models/tournament_teams');
    const mongoose = require('mongoose');

    let TournamentService = function (teams) {
        this.teams = new Array();
        this.populateTournament = [
            {
                path: '_team',
                populate: [
                    {path: '_players'},
                    {path: '_team_master'}]
            }];

        this.populateQuery = [
            {path: '_tournament_master'},
            {path: '_users'}
        ];
    }

    TournamentService.prototype.addPosition = function (tournaments) {
        tournaments.forEach(tournament=>{
            tournament._teams.forEach((team, arrIndex) => {
                team.position = arrIndex + 1;
                team._tournament = tournament._id;
                team.team_total += tournament._tournament[0].budget;
                this.teams.push(team);
            })
        });
        console.log(JSON.stringify(this.teams,null,2));
        return this;
    }

    TournamentService.prototype.getTargetTeams = function (target_ids) {
        if (target_ids.length !== 0) {
            this.teams = this.teams.filter((team) => {
                if (target_ids.indexOf(team._team.toString()) !== -1) {
                    return team;
                }
            })
        }
        return this;
    }

    TournamentService.prototype.populateTeamsAndPutResponse = function (res) {
        TournamentTeams.populate(
            this.teams, this.populateTournament, function (err, results) {
                if (err) throw err;
                console.log(JSON.stringify(results, undefined, 2));
                return res.send(results);
            });
    }


    TournamentService.prototype.getTournamentTeamsTotal = function (query, res) {
        that = this;
        TournamentTeams.aggregate([
                {$match: {"_tournament": new mongoose.Types.ObjectId(query)}},
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
                    that.addPosition(tournaments).populateTeamsAndPutResponse(res);

                }
            });
    }


    TournamentService.prototype.getTournaments = function (Tournament,query, res) {
        Tournament.find(query).populate(this.populateQuery).exec(function (err, tournaments) {
            if (err) {
                console.log('ERROR GETTING TOURNAMENTS: ');
                res.status(500).json({error: err});
            } else {

                res.status(200).json(tournaments);
            }
        });
    }
    return TournamentService;
}

