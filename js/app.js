angular.module('jeopardyApp', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html',
            controller: 'MainController'
        })
        .when('/random', {
            templateUrl: 'partials/random.html',
            controller: 'RandomController'
        })
        .when('/question/:id', {
            templateUrl: 'partials/detail.html',
            controller: 'DetailController'
        })
        .otherwise({
            redirectTo: '/'
        });
}])

.service('QuestionService', ['$http', function($http) {
    return {
        getQuestionData: function() {
            return $http.get('jeopardy.json');
        }
    };
}])

.controller('MainController', ['$scope', function($scope) {
    $scope.customMessage = 'Let\'s play Jeopardy.';
}])

.controller('RandomController', ['$scope', 'QuestionService', function($scope, QuestionService) {
    /*
     * Returns a random integer between min (inclusive) and max (exclusive)
     */
    var getRandomInteger = function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    };

    $scope.initialize = function() {
        QuestionService.getQuestionData()
            .then(function(response) {
                $scope.allQuestions = response.data;
                $scope.generateQuestion();
            })
            .catch(function() {
                $scope.errorMessage = 'Unable to load question data';
            });
    };

    $scope.generateQuestion = function() {
        var randomInteger = getRandomInteger(0, $scope.allQuestions.length);
        $scope.randomQuestion = $scope.allQuestions[randomInteger];
    };
}])

.controller('DetailController', ['$scope', '$routeParams', 'QuestionService', function($scope, $routeParams, QuestionService) {
    $scope.initialize = function() {
        QuestionService.getQuestionData()
            .then(function(response) {
                $scope.allQuestions = response.data;
                $scope.questionNumber = parseInt($routeParams.id);
                $scope.question = $scope.allQuestions[$scope.questionNumber];
            })
            .catch(function() {
                $scope.errorMessage = 'Unable to load question data';
            });
    };
}]);