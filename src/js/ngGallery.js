(function () {
    'use-strict';

    angular.module('jkuri.gallery', []).directive('ngGallery', ngGallery);

    ngGallery.$inject = ['$templateCache', 'MessageBus'];

    function ngGallery($templateCache, MessageBus) {

        var defaults = {
            baseClass: 'ng-gallery',
            thumbClass: 'ng-thumb',
            templateUrl: 'ng-gallery.html'
        };

        function setScopeValues(scope, attrs) {
            scope.baseClass = scope.class || defaults.baseClass;
            scope.thumbClass = scope.thumbClass || defaults.thumbClass;
            scope.thumbsNum = scope.thumbsNum || 3; // should be odd
        }

        var template_url = defaults.templateUrl;
        // Set the default template
        $templateCache.put(template_url,
            '<div class="{{ baseClass }}">' +
            '  <div ng-repeat="i in images">' +
            '    <img ng-src="{{ i.thumb }}" class="{{ thumbClass }}" ng-click="openGallery($index)" alt="Image {{ $index + 1 }}" />' +
            '  </div>' +
            '</div>'
        );

        return {
            restrict: 'EA',
            scope: {
                images: '=',
                thumbsNum: '@',
                hideOverflow: '='
            },
            controller: [
                '$scope',
                function ($scope) {
                    $scope.$on('openGallery', function (e, args) {
                        $scope.openGallery(args.index);
                    });
                }
            ],
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || defaults.templateUrl;
            },
            link: function (scope, element, attrs) {
                setScopeValues(scope, attrs);

                if (scope.thumbsNum >= 11) {
                    scope.thumbsNum = 11;
                }

                //                var $thumbnails = angular.element(element[0].querySelectorAll('.ng-thumbnails'));

                scope.index = 0;
                scope.opened = false;

                scope.thumb_wrapper_width = 0;
                scope.thumbs_width = 0;

                scope.showImageDownloadButton = function () {
                    if (scope.images[scope.index] == null || scope.images[scope.index].downloadSrc == null) {
                        return
                    }
                    var image = scope.images[scope.index];
                    return angular.isDefined(image.downloadSrc) && 0 < image.downloadSrc.length;
                };

                scope.getImageDownloadSrc = function () {
                    if (scope.images[scope.index] == null || scope.images[scope.index].downloadSrc == null) {
                        return
                    }
                    return scope.images[scope.index].downloadSrc;
                };

                scope.openGallery = function (i) {
                    MessageBus.notify("ngGalleryOpen", scope.images, i);
                };

            }
        };
    }
})();
