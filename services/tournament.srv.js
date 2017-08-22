module.exports = function (teams) {

    let TournamentTeams = require('../models/tournament_teams');
    const mongoose = require('mongoose');

    let TournamentService = function (teams) {
        this.teams = teams;
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

    TournamentService.prototype.addPosition = function (teams) {
        this.teams = teams.map((team, arrIndex) => {
            team.position = arrIndex + 1;
            return team;
        })
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
                {$sort: {tournament: 1, team_total: -1,}},

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

