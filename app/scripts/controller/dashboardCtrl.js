﻿'use strict';

var devQ = angular.module('devQ');

devQ.controller('dashboardCtrl', ['$scope', '$state', 'authService', 'firebaseService', function ($scope, $state, authService, firebaseService) {

    firebaseService.getMentor($scope.user.id).then(function(res) {
        $scope.mentor = res;
    });

    $scope.statusClass = function(mentor) {
        if(mentor) {
            if(mentor.status === 'Available') {
                return 'status-light-green';
            } else if(mentor.status === 'Busy') {
                return 'status-light-yellow';
            } else {
                return 'status-light-red';
            }
        }
    };

    $scope.toggleStatus = function () {
        if ($scope.mentor.status === 'Available') {
            $scope.mentor.status = 'Away';
            $scope.mentor.$save();
        } else {
            $scope.mentor.status = 'Available';
            $scope.mentor.$save();
        }
    };

    $scope.logOff = function() {
        $scope.mentor.status = 'Away';
        $scope.mentor.$save();
        authService.logOut().then(function() {
           $state.go('mentor');
        });
    };

    $scope.addCohort = function() {
        var cohort = {};
        cohort.status = true;
        cohort.name = $scope.cohortName;
        $scope.cohorts.$add(cohort);
        $scope.cohortName = '';
    };

    $scope.removeCohort = function(cohort) {
        cohort.status = false;
        $scope.cohorts.$save(cohort);
    };

    $scope.viewCohort = function (cohort) {
        $state.go('secure.queue', { queueId: cohort.$id });
    };
}]);