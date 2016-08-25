angular.module('jeopardyApp', ['ngRoute', 'ngSanitize'])

.config(['$routeProvider', function($routeProvider) {
    /**
     * Routes provide a way for us to navigate from one web view to
     * another. Each view has a different controller. Think of the
     * view as what you see on the web page and the controller controls
     * how that view got generated / how it changes as users interact
     * with the view.
     */
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

/**
 * A service serves as the main hub for all data requests (aka, the model).
 * We want to have a centralized place where we can get the question data
 * and this service might expand if we decide to do different types of data
 * requests in the future. But for now, this is the one-stop-shop to getting
 * the question data.
 */
.service('QuestionService', ['$http', function($http) {
    return {
        getQuestionData: function() {
            return $http.get('jeopardy.json');
        }
    };
}])

/**
 * Each controller has a $scope object. This syntax always injects
 * this $scope object into each controller. How $scope works can get
 * quite complicated as more complexity is added to an Angular app,
 * but for our purposes, each controller has its own $scope. Which means,
 * any kind of variable state or changes live within this controller and no
 * where else. It is possible to share different variables amongst different
 * controllers, but we will discuss that later.
 */
.controller('MainController', ['$scope', function($scope) {
    $scope.customMessage = 'Let\'s play Jeopardy.';
}])

/**
 * A controller can have variables as well as functions attached to its $scope.
 * These can control how the view is laid out and what changes happen.
 * We can also inject services into a controller so that the controller can have
 * access and use them. In our case, we would like to get the question data, so
 * our controller has access to the QuestionService, which provides one method
 * to access the data.
 */
.controller('RandomController', ['$scope', 'QuestionService', function($scope, QuestionService) {
    $scope.currentScore = 0;
    /*
     * Returns a random integer between min (inclusive) and max (exclusive)
     */
    var getRandomInteger = function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    };

    $scope.generateQuestion = function() {
        var randomInteger = getRandomInteger(0, $scope.allQuestions.length);
        $scope.randomQuestion = $scope.allQuestions[randomInteger];
        $scope.alreadySeenQuestion = false;
        $scope.answerIsShowing = false;
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

    var parseNumericValue = function(value) {
        return parseInt(value.substring(1));
    };

    $scope.addToScore = function() {
        $scope.currentScore += parseNumericValue($scope.randomQuestion.value);
        $scope.alreadySeenQuestion = true;
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