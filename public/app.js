$(document).ready(function () {
// populate hourOfDay select
  for (var i=0; i<24; i++) {
    $('.hourOfDay').append('<option>'+i+'</option>');
  }
  $('form').on('submit', function(event) {
    event.preventDefault();
// request selected airport arrivals over specified time period
    var date = $('.date').val().replace(/-/g,'/')
    var request = 'http://galvanize-cors-proxy.herokuapp.com/https://api.flightstats.com/flex/flightstatus/rest/v2/json/airport/status/'+ $('.airport').val()+"/arr/"+date+"/"+$('.hourOfDay').val()+"?appId=dfc59556&appKey=5c6c8072307e694391326f3ed034fbe6&utc=false&numHours="+$('.numHours').val();
    console.log(request);
    $.get(request, function(data) {
// put data into specified windows and print busiest times plus graph of specified time period
      var times = [];
      var start = Number($('.hourOfDay').val());
      var end = Number($('.hourOfDay').val())+Number($('.numHours').val());
      for (var i=start; i<=end; i+=.25) {
        times.push({name: i, value:0})
      }
      console.log(times)

      var flights = data.flightStatuses.length
      for (var i=0; i<flights; i++) {
        var arrive = data.flightStatuses[i].operationalTimes.flightPlanPlannedArrival.dateLocal;

        var arrive1 = data.flightStatuses[i].operationalTimes.flightPlanPlannedArrival.dateLocal.split('T');
        var arrive2 = arrive1[1].split(':');
        console.log(arrive2);

        // var hours, minutes;
        // for (var j=0; j<arrive.length; j++) {
        //   if (j===12 || j===13) {
        //     hours += arrive[j];
        //   } else if (j===15 || j===16) {
        //       minutes += arrive[j];
        //     }
        //   }
        }
        console.log(hours, minutes);
      }
    )
  })
})

// populate airport list from API
