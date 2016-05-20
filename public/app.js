$(document).ready(function () {
// populate date input
  var date = new Date();
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;
  var today = year + "-" + month + "-" + day;
  $("#theDate").attr("value", today);
// populate hourOfDay select options
  $('#hourOfDay').append('<option value='+00+'>12:00 am'+'</option>');
  for (let i=1; i<12; i++) {
    $('#hourOfDay').append('<option value='+i+'>'+i+':00 am'+'</option>');
  }
  $('#hourOfDay').append('<option value='+12+' selected>12:00 pm'+'</option>');
  for (let i=1; i<12; i++) {
    $('#hourOfDay').append('<option value='+(i+12)+'>'+i+':00 pm'+'</option>');
  }
  $('form').on('submit', function(event) {
    event.preventDefault();
// request selected airport's arrivals over specified time period
    var date = today.replace(/-/g,'/')
    var request = 'https://galvanize-cors-proxy.herokuapp.com/https://api.flightstats.com/flex/flightstatus/rest/v2/json/airport/status/'+ $('#airports').val()+"/arr/"+date+"/"+$('#hourOfDay').val()+"?appId=dfc59556&appKey=5c6c8072307e694391326f3ed034fbe6&utc=false&numHours="+$('#numHours').val();
    console.log(request);
    $.get(request, function(data) {
// put data into specified windows and print busiest times plus graph of specified time period
  //arrivals data into an array
      $("img").hide();
      var flightStatusesLength = data.flightStatuses.length;
      var flights = [];
      var binFlights = {};
      var times = [];
      for (var i=0; i<flightStatusesLength; i++) {
        var arrive1 = data.flightStatuses[i].arrivalDate.dateLocal.split('T');
        var arrive2 = arrive1[1].split(':');
        times.push(arrive2)
      }
  // sort arrays by arrival time
      times = times.sort(function(a,b) {
        var x=a[0] - b[0];
        return x == 0? a[1] - b[1] : x;
      });
      // console.log(times);
  // 'normalize' data into 15min bins
      var normalize = [];
      for (var j = 0; j<times.length; j++) {
        function bin(minutes) {
          if (minutes >= 51 && minutes <= 59) {
            return bin = (parseInt(times[j][0])+1)+":15";
          } else if (minutes >= 0 && minutes <= 5) {
            return bin = times[j][0]+":15";
          } else if(minutes >= 6 && minutes <= 20) {
            return bin = times[j][0]+":30";
          } else if (minutes >= 21 && minutes <= 35) {
            return bin = times[j][0]+":45";
          } else if (minutes >= 36 && minutes <= 50) {
            return bin = (parseInt(times[j][0])+1)+":00";
          }
        }
        normalize.push(bin(times[j][1]));
      }
  // count number of flights in each bin
      var counter = 1;
      for (var k=0; k<normalize.length; k++) {
        if (normalize[k] === normalize[k+1]) {
          counter += 1;
        } else {
          flights.push({name: (moment(normalize[k], 'HH:mm').format('h:mm A')), value: counter});
          counter = 1;
        }
      }
  // display graph of number of flights for each bin
      // d3.select(".chart")
      //   .selectAll("div")
      //     .data(flights)
      //   .enter().append("div")
      //     .style("width", function(d) {return d.value * 10 + "px"; })
      //     .text(function(d) { return d.name; })
  // sort bins and display three highest values
      var topThree=flights.sort(function(a,b) {
        if (a.value<b.value) {
          return 1;
        } else if (a.value>b.value) {
          return -1;
        } else {
          return 0;
        }
      })
      // get mean and standard deviation
      var nums = [];
      for (var l=0; l<flights.length; l++) {
        nums.push(flights[l].value);
      }
      var mean = math.mean(nums)
      var standardDev = math.std(nums)
      var devs = [];
      for (var m=0; m<flights.length; m++) {
        devs.push((flights[m].value - mean) / standardDev)
      }
      flame = '<img class=flame src="http://www.clipartbest.com/cliparts/yTo/M4r/yToM4rELc.png">'
      if (devs[0] >= 2 && devs[1] >=2 && devs[2] >=2) {
        $("h3").html('<Top Three Times to Get A Rider<br>'+topThree[0].name+flame+', '+topThree[1].name+flame+', '+topThree[2].name+flame);
      } else if (devs[0] >= 2 && devs[1] >=2) {
        $("h3").html('Top Three Times to Get A Rider <br>'+topThree[0].name+flame+', '+topThree[1].name+flame+', '+topThree[2].name);
      } else if (devs[0] >= 2) {
        $("h3").html('Top Three Times to Get A Rider <br>'+topThree[0].name+flame+', '+topThree[1].name+', '+topThree[2].name);
      } else {$("h3").html('Top Three Times to Get A Rider <br>'+topThree[0].name+', '+topThree[1].name+', '+topThree[2].name)}
      console.log(devs);
    })
  })
})
