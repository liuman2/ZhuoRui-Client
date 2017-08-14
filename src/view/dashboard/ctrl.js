var moment = require('moment');
moment.locale('zh-cn');
module.exports = function($scope, $state, $http, $q, $timeout) {

  $scope.banner = {
    customers: 0,
    annuals: 0
  }

  function initData() {
    $scope.schedule = {
      id: '',
      title: '',
      start: '',
      end: '',
      color: '', // #9FE1E7
      type: 0,
      people: [],
      location: '',
      memo: '',
      editable: true,
      all_day: 0,
    }
  }

  $scope.memberList = [];
  $scope.todayList = [];

  function getMember() {
    $http({
      method: 'GET',
      url: '/Member/List',
      params: {
        index: 1,
        size: 9999,
        name: ''
      }
    }).success(function(data) {
      $scope.memberList = data.items || [];
    });
  }

  getMember();

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
  });

  $http({
    method: 'GET',
    url: '/Notice/GetTop3'
  }).success(function(data) {
    console.log(data)
    $scope.sinpleNotices = data;
  });

  function getTodayEvents() {
    $http({
      method: 'GET',
      url: '/Schedule/GetToday'
    }).success(function(data) {
      $scope.todayList = data || [];
    });
  }

  function initCalendar() {
    $('#calendar').fullCalendar({
      droppable: true,
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay'
      },
      displayEventTime : false,
      defaultView: 'month',
      editable: true,

      events: function(start, end, timezone, callback) {
        // var date = this.getDate().format('YYYY-MM');
        $.ajax({
          url: '/Schedule/Search',
          dataType: 'json',
          // data: {
          //   id: { $id },
          //   date: date,
          // },
          success: function(data) {
            var events = data;
            callback(events);
          }
        });
      },
      eventRender: function(event, element) {
        var copyEvent = angular.copy(event);

        var end = '';
        if (copyEvent.end) {
          end = moment(copyEvent.end).format('YYYY-MM-DD HH:mm');
        }
        var priority = '';
        var forp = '';
        switch (copyEvent.color) {
          case '#51B749':
            priority = '重要但不紧急';
            break;
          case '#DC2127':
            priority = '重要且紧急';
            break;
          case '#DBADFF':
            priority = '不重要但紧急';
            break;
          case '#5484ED':
            priority = '不重要不紧急';
            break;
        }
        switch (copyEvent.type) {
          case 0:
            forp = '个人';
            break;
          case 1:
            forp = '指定人员';
            break;
          case 2:
            forp = '全公司';
            break;
        }

        var members = [];
        var peopleDisplay = 'none';
        var endDisplay = 'none';
        if (copyEvent.type == 1) {
          peopleDisplay = 'block';
          for (var i = 0; i < copyEvent.peoples.length; i++) {
            members.push(copyEvent.peoples[i].name);
          }
        }
        if (!copyEvent.allDay) {
          endDisplay = 'block';
        }

        var peopleNmaes = members.join(', ');
        var content = '<div class="event-tip">\
          <div class="mt-10 mb-10"><span class="column">主&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;题:</span><span class="column-value">' + copyEvent.title + '</span></div>\
          <div class="mb-10"><span class="column">全天事件:</span><span class="column-value">' + (copyEvent.allDay ? "是" : "否") + '</span></div>\
          <div class="mb-10"><span class="column">开始时间:</span><span class="column-value">' + moment(copyEvent.start).format('YYYY-MM-DD HH:mm') + '</span></div>\
          <div class="mb-10" style="display:' + endDisplay + ';"><span class="column">结束时间:</span><span class="column-value">' + end + '</span></div>\
          <div class="mb-10"><span class="column">地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;点:</span><span class="column-value">' + copyEvent.location + '</span></div>\
          <div class="mb-10"><span class="column">优&nbsp;&nbsp;先&nbsp;&nbsp;级:</span><span class="column-value"><span class="tip-color" style="background: ' + copyEvent.color + '; border: 1px solid ' + copyEvent.color + ';"></span>' + priority + '</span></div>\
          <div class="mb-10"><span class="column">权限范围:</span><span class="column-value">' + forp + '</span></div>\
          <div class="mb-10" style="display:' + peopleDisplay + ';"><span class="column">参与人员:</span><span class="column-value">' + peopleNmaes + '</span></div>\
          <div class="mb-10"><span class="column">创&nbsp;&nbsp;建&nbsp;&nbsp;人:</span><span class="column-value">' + copyEvent.creator + '</span></div>\
          <div class="mb-10"><span class="column">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注:</span><span class="column-value">' + copyEvent.memo + '</span></div>\
          </div>';

        element.tooltipster({
          theme: 'tooltipster-sideTip-shadow',
          position: 'right',
          content: content,

          contentAsHTML: true
        });
      },

      dayClick: function(date, jsEvent, view) {
        initData();
        var dt = moment(date).format('YYYY-MM-DD HH:mm'); // date.format();

        if (view.name == 'month') {
          dt = moment(date).format('YYYY-MM-DD') + ' '+ moment(new Date()).format('HH:mm')
        }

        $scope.schedule.start = dt.replace('T', ' ');
        $state.go(".event_add", null, { location: false });
      },
      eventClick: function(calEvent, jsEvent, view) {
        if (!calEvent.editable) {
          return;
        }

        var copyEvent = angular.copy(calEvent);

        if (typeof(copyEvent.start) == 'object') {
          copyEvent.start = moment(copyEvent.start).format('YYYY-MM-DD HH:mm'); //copyEvent.start.format('YYYY-MM-DD HH:MM');
          copyEvent.start = copyEvent.start.replace('T', ' ');
        }
        if (typeof(copyEvent.end) == 'object') {
          if (copyEvent.end) {
            copyEvent.end = moment(copyEvent.end).format('YYYY-MM-DD HH:mm'); // copyEvent.end.format('YYYY-MM-DD HH:MM');
            copyEvent.end = copyEvent.end.replace('T', ' ');
          }
        }

        $scope.schedule = copyEvent;
        $state.go(".event_edit", null, { location: false });
      }
    })
  }

  $scope.$on('EVENT_MODAL_DONE', function(e) {
    initCalendar();
    $("#calendar").fullCalendar('refetchEvents');
    getTodayEvents();
  });

  initCalendar();
  getTodayEvents();
};
