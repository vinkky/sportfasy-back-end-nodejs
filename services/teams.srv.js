module.exports = function (teams) {

    let TournamentTeams = require('../models/tournament_teams');

    let TeamsService = function (teams) {
        this.teams = teams;
    }

    TeamsService.prototype.addPosition = function (teams) {
        this.teams = teams.map((team, arrIndex) => {
            team.position = arrIndex + 1;
            return team;
        })
        return this;
    }

    TeamsService.prototype.getTargetTeams = function (target_ids) {

        if (target_ids.length !== 0) {
            this.teams = this.teams.filter((team) => {
                if (target_ids.indexOf(team._team.toString()) !== -1) {
                    console.log("target: " + team);
                    return team;
                }
            })
        }
        return this;
    }

    TeamsService.prototype.populateTeamsAndResponse = function (populateQuery, res) {
        TournamentTeams.populate(
            this.teams, populateQuery, function (err, results) {
                if (err) throw err;
                console.log(JSON.stringify(results, undefined, 2));
                console.log('good');
                return res.send(results);
            });
    }


    TeamsService.prototype.getTeamsTotal = function (query, populateQuery, res) {
        that = this;
        TournamentTeams.aggregate([
                // {$match: query},
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
                {$sort: {tournament: 1, team_total: -1,}},

            ],
            function (err, teams) {
                if (err) {
                    console.log('error grouping teams in Player Ledger ');
                } else {
                    that.addPosition(teams).getTargetTeams(query).populateTeamsAndResponse(populateQuery, res);
                }
            });
    }
    return TeamsService;
}

