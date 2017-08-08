var moment = require('moment');
moment.locale('zh-cn');
module.exports = function($scope, $state, $http, $q, $timeout) {

  $scope.banner = {
    customers: 0,
    annuals: 0
  }

  $scope.format = function(dt, str) {
    if (!dt) {
      return '';
    }
    return moment(dt).format(str);
  }

  $http({
    method: 'GET',
    url: '/Home/DashboardInfo'
  }).success(function(data) {
    $scope.banner = data.banner;
    // $scope.recently_customers = data.customers || [];
  });

  $http({
    method: 'GET',
    url: '/Notice/GetTop3'
  }).success(function(data) {
    console.log(data)
    $scope.sinpleNotices = data;
  });

  $('#calendar').fullCalendar({
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay'
    },
    defaultView: 'month',
    editable: true,
    events: [{
        id: 12,
        title: '开会',
        start: '2017-08-07T16:00:00',
        editable: false,
      },
      {
        id: 13,
        title: '拜访客户',
        start: '2017-08-08T13:00:00',
        end: '2017-08-08T15:00:00',
        color: 'red',
      },
    ],
    dayClick: function(date, jsEvent, view) {
      alert('Clicked on: ' + date.format());
      // alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);

      // alert('Current view: ' + view.name);

      // change the day's background color just for fun
      // $(this).css('background-color', 'red');
    },
    eventClick: function(calEvent, jsEvent, view) {
      alert('Event: ' + calEvent.title);
      // alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
      // alert('View: ' + view.name);
      // $(this).css('border-color', 'red');
    }
  })
};
