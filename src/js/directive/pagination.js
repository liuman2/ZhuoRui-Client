module.exports = exports = function() {

    return {
        restrict: 'EA',
        scope: {
            'data': '=pageData',
            'callback': '&pageClick'
        },
        template: tmpl,
        controller: ctrl
    };

    function ctrl($scope, $attrs) {
        var ctrl = this;
        var maxSize = 3;
        var rotate = true;
        var boundaryLinkNumbers = true;
        var forceEllipses = false;
        $scope.inputNumber = '';

        // data watch
        $scope.$watch('data', function(value) {
            console.log(value)
            if (value) {
                getPages(value);
            }
        });

        // event
        $scope.goto = function(idx) {
            // if (typeof idx === 'number' && idx > 0 && idx <= $scope.totalPages) {
            //   $scope.callback({ idx: idx });
            // }
            if (/^\d+$/ig.test(idx) && idx > 0 && idx <= $scope.totalPages) {
                $scope.callback({
                    idx: idx
                });
            }
        }

        $scope.enter = function($event) {
            var keycode = window.event ? $event.keyCode : $event.which;
            if (keycode === 13) {
                $scope.goto($scope.inputNumber);
            }
        }

        $scope.verify = function() {
            $scope.inputNumber = $scope.inputNumber.replace(/[^\d]/ig, '').replace(/^0+/ig, '');
        }

        function makePage(number, text, isActive) {
            return {
                number: number,
                text: text,
                active: isActive
            };
        }

        function getPages(data) {
            var pages = [];
            var totalPages = data.total_page;
            var currentPage = data.current_index;

            var startPage = 1;
            var endPage = totalPages;
            var isMaxSized = maxSize && maxSize < totalPages;

            if (isMaxSized) {
                if (rotate) {
                    // Current page is displayed in the middle of the visible ones
                    startPage = Math.max(currentPage - Math.floor(maxSize / 2), 1);
                    endPage = startPage + maxSize - 1;

                    // Adjust if limit is exceeded
                    if (endPage > totalPages) {
                        endPage = totalPages;
                        startPage = endPage - maxSize + 1;
                    }
                } else {
                    // Visible pages are paginated with maxSize
                    startPage = (Math.ceil(currentPage / maxSize) - 1) * maxSize + 1;

                    // Adjust last page if limit is exceeded
                    endPage = Math.min(startPage + maxSize - 1, totalPages);
                }
            }

            // Add links to move between page sets
            for (var number = startPage; number <= endPage; number++) {
                var page = makePage(number, number, number === currentPage);
                pages.push(page);
            }

            // Add links to move between page sets
            if (isMaxSized && maxSize > 0 && (!rotate || forceEllipses || boundaryLinkNumbers)) {
                if (startPage > 1) {
                    if (!boundaryLinkNumbers || startPage > 3) { //need ellipsis for all options unless range is too close to beginning
                        var previousPageSet = makePage(startPage - 1, '...', false);
                        pages.unshift(previousPageSet);
                    }
                    if (boundaryLinkNumbers) {
                        if (startPage === 3) { //need to replace ellipsis when the buttons would be sequential
                            var secondPageLink = makePage(2, '2', false);
                            pages.unshift(secondPageLink);
                        }
                        //add the first page
                        var firstPageLink = makePage(1, '1', false);
                        pages.unshift(firstPageLink);
                    }
                }

                if (endPage < totalPages) {
                    if (!boundaryLinkNumbers || endPage < totalPages - 2) { //need ellipsis for all options unless range is too close to end
                        var nextPageSet = makePage(endPage + 1, '...', false);
                        pages.push(nextPageSet);
                    }
                    if (boundaryLinkNumbers) {
                        if (endPage === totalPages - 2) { //need to replace ellipsis when the buttons would be sequential
                            var secondToLastPageLink = makePage(totalPages - 1, totalPages - 1, false);
                            pages.push(secondToLastPageLink);
                        }
                        //add the last page
                        var lastPageLink = makePage(totalPages, totalPages, false);
                        pages.push(lastPageLink);
                    }
                }
            }

            $scope.pages = pages;
            $scope.totalPages = totalPages;
            $scope.currentPage = currentPage;

            if ($scope.inputNumber && $scope.inputNumber != currentPage) {
                $scope.inputNumber = '';
            }

            $("html,body").animate({
                scrollTop: 0
            }, 200);
        }
    }
}

// var tmpl = `
// <div class="pagination pull-right clearfix">
//   <ul class="pagination-pager">
//     <li><a href class="previous" ng-click="goto(currentPage - 1)">&lsaquo;</a></li>
//     <li ng-repeat="page in pages">
//       <a href ng-class="{active:page.active}" ng-click="goto(page.number)">{{page.text}}</a>
//     </li>
//     <li><a href class="next" ng-click="goto(currentPage + 1)">&rsaquo;</a></li>
//   </ul>
//   <div class="pagination-jump">
//     <span class="total">共{{ totalPages }}页</span>
//     <span class="jump">到第<input type="text" ng-model="inputNumber" ng-keyup="enter($event)" ng-change="verify($event)">页</span>
//     <a href class="btn" ng-click="goto(inputNumber)">确定</a>
//   </div>
// </div>`;

var tmpl = `
<div class="pagination pull-right clearfix">
  <ul class="pagination-pager">
    <li><a href class="previous" ng-click="goto(currentPage - 1)">&lsaquo;</a></li>
    <li ng-repeat="page in pages">
      <a href ng-class="{active:page.active}" ng-click="goto(page.number)">{{page.text}}</a>
    </li>
    <li><a href class="next" ng-click="goto(currentPage + 1)">&rsaquo;</a></li>
  </ul>
</div>`;
