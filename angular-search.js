angular.module('angular-search-box', []).directive('searchBox', function ($rootScope) {
  return {
    replace: true,
    restrict: 'E',
    scope: {
        values: "=",
        selectedItem: "=",
        key: "@",
        onScroll: "&",
        totalRecords: "="
    },
    templateUrl: 'searchBox.html',
    link: function (scope, element, attr) {
      scope.showResult = false;
      scope.selectItem = function (item) {
        scope.selectedItem = item;
        scope.showResult = false;
      };
      scope.isActive = function (item) {
        return item[scope.key] === scope.selectedItem[scope.key];
      };
      scope.search = function (searchKey) {
        if (searchKey.length === 0 || searchKey.length > 2) {
          //passing data to onscroll to call for API Service
          scope.onScroll({
            searchKey: searchKey,
            pageNumber: 1
          });
        }
      };
      scope.show = function () {
        scope.showResult = !scope.showResult;
      };
      $rootScope.$on("documentClicked", function (inner, target) {
        var isSearchBox = ($(target[0]).is(".searchBox")) || ($(target[0]).parents(".searchBox").length > 0);
        if (!isSearchBox)
          scope.$apply(function () {
            scope.showResult = false;
        });
      });
      element.find(".dropdown").bind('scroll', function () {
        var currentItem = $(this);
        if (currentItem.scrollTop() + currentItem.innerHeight() >= currentItem[0].scrollHeight) {
          if (!scope.pageNumber)
            scope.pageNumber = 2;
          else
            scope.pageNumber = scope.pageNumber + 1;
          scope.onScroll({
              searchKey: scope.searchKey,
              pageNumber: scope.pageNumber
          });
        }
      });
    }
  };
});
