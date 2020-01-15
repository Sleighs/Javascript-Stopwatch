var STOPWATCH = {
  hour: 0,
  min: 0,
  sec: 0,
  ms: 0,
  timeBeganMaster: null,
  timeBegan: null, 
  timeStopped: null,
  lapBegan: null,
  lapStopped: null,
  stoppedDuration: 0, 
  masterTime: null,
  started: null,
  state: "new",
  laps: [],
  lapState: false,
  start: function(){
    if (this.state == "started"){
      this.stop();
    } else {
      if (this.timeBegan === null) {
        this.timeBegan = new Date();
        this.timeBeganMaster = this.timeBegan;
      }

      if (this.timeStopped !== null) {
          this.stoppedDuration += (new Date() - this.timeStopped);
      }
      //console.log(this.stoppedDuration);

      this.started = setInterval(this.clockRunning, 10);
      this.state = "started";
      document.getElementById("sw-start").innerHTML = "Stop";
      document.getElementById("sw-lap-btn").style.display = "inline-block";
      this.blink("start stopwatch");    
    }
  },
  stop: function(){
    this.timeStopped = new Date();
    this.state = "stopped";
    document.getElementById("sw-start").innerHTML = "Start";
    this.blink("stop stopwatch");
    clearInterval(this.started);
  },
  reset: function() {
    clearInterval(this.started);
    this.stoppedDuration = 0;
    this.timeBeganMaster = null;
    this.timeBegan = null;
    this.timeStopped = null;
    this.lapBegan = null;
    this.lapStopped = null;
    this.laps = [];
    this.state = "new";
    this.lapState = false;
    document.getElementById("stopwatch-time").innerHTML = "00:00:00.000";
    document.getElementById("stopwatch-master").innerHTML = "00:00:00.000";
    document.getElementById("sw-start").innerHTML = "Start";
    document.getElementById("sw-lap-btn").style.display = "none";
    document.getElementById("stopwatch-master").style.display = "none";
    document.getElementById("laps-list").style.display = "none";
  },
  clockRunning: function(){
    var currentTime = new Date()
        , timeElapsed = new Date(currentTime - STOPWATCH.timeBegan - STOPWATCH.stoppedDuration);
        STOPWATCH.hour = timeElapsed.getUTCHours();
        STOPWATCH.min = timeElapsed.getUTCMinutes();
        STOPWATCH.sec = timeElapsed.getUTCSeconds();
        STOPWATCH.ms = timeElapsed.getUTCMilliseconds();

    document.getElementById("stopwatch-time").innerHTML = 
        (STOPWATCH.hour > 9 ? STOPWATCH.hour : "0" + STOPWATCH.hour) + ":" + 
        (STOPWATCH.min > 9 ? STOPWATCH.min : "0" + STOPWATCH.min) + ":" + 
        (STOPWATCH.sec > 9 ? STOPWATCH.sec : "0" + STOPWATCH.sec) + "." + 
        (STOPWATCH.ms > 99 ? STOPWATCH.ms : STOPWATCH.ms > 9 ? "0" + STOPWATCH.ms : "00" + STOPWATCH.ms);
    
    //Master time
    var masterTime = new Date()
        , masterTimeElapsed = new Date(masterTime - STOPWATCH.timeBeganMaster - STOPWATCH.stoppedDuration);
        STOPWATCH.hourM = masterTimeElapsed.getUTCHours();
        STOPWATCH.minM = masterTimeElapsed.getUTCMinutes();
        STOPWATCH.secM = masterTimeElapsed.getUTCSeconds();
        STOPWATCH.msM = masterTimeElapsed.getUTCMilliseconds();

    document.getElementById("stopwatch-master").innerHTML = 
        (STOPWATCH.hourM > 9 ? STOPWATCH.houM : "0" + STOPWATCH.hourM) + ":" + 
        (STOPWATCH.minM > 9 ? STOPWATCH.minM : "0" + STOPWATCH.minM) + ":" + 
        (STOPWATCH.secM > 9 ? STOPWATCH.secM : "0" + STOPWATCH.secM) + "." + 
        (STOPWATCH.msM > 99 ? STOPWATCH.msM : STOPWATCH.msM > 9 ? "0" + STOPWATCH.msM : "00" + STOPWATCH.msM);
  },
  lap: function(hr, min, sec, ms) {
    this.hour = hr;
    this.min = min;
    this.sec = sec;
    this.ms = ms;
  },
  newLap: function() {
    // Do nothing if stopwatch is stopped else make lap
    if (this.state == "new"){
      return;
    } else { 
      this.lapState = true;
    }
    
    this.lapBegan = new Date();
    
    var lapTime = new Date(this.lapBegan -= this.timeBegan);
    console.log(lapTime.getUTCSeconds());

    // Save new lap to laps array using lap constructor and push
    var newLapTime = new this.lap(
      this.hour,
      this.min,
      this.sec,
      this.ms
    );
    this.laps.push(newLapTime);

    //show lap time
      //loop through laps array and add each to table
      //format: time of lap | total time
    if (this.laps.length > 0) {
      document.getElementById("laps-list").style.display = "inline-block";
    }  

    var lapTimesEle = document.getElementById("lap-times");
    // Clear lap table for refresh
    while (lapTimesEle.firstChild) {
      lapTimesEle.removeChild(lapTimesEle.firstChild);
    }
    // Create lap list item for each lap and add to list
    for (var i = 0; i < this.laps.length; i++){
      var currentLap =   
        (this.laps[i].hour > 9 ? this.laps[i].hour : "0" + this.laps[i].hour) + ":" + 
        (this.laps[i].min > 9 ? this.laps[i].min : "0" + this.laps[i].min) + ":" + 
        (this.laps[i].sec > 9 ? this.laps[i].sec : "0" + this.laps[i].sec) + "." + 
        (this.laps[i].ms > 99 ? this.laps[i].ms : this.laps[i].ms > 9 ? "0" + this.laps[i].ms : "00" + this.laps[i].ms);
      
      var lapData = document.createElement("li");
      lapData.innerHTML = currentLap;
      lapTimesEle.appendChild(lapData);
    }
    
    //reset stopwatch
    document.getElementById("stopwatch-time").innerHTML = "00:00:00.000";
    STOPWATCH.hour = 0;
    STOPWATCH.min = 0;
    STOPWATCH.sec = 0;
    STOPWATCH.ms = 0;
    this.timeBegan = new Date();
    
    //show master time
    document.getElementById("stopwatch-master").style.display = "block";
  },
  blink: function(type) {
    var stopwatchDigits = document.querySelectorAll(".stopwatch-time-digits");

    if (type == "start stopwatch") {
      //add blink class to text
      stopwatchDigits.forEach(function(ele) {
        ele.classList.add("blink-text");
      });
    }
    if (type == "stop stopwatch") {
      //add blink class to text
      stopwatchDigits.forEach(function(ele) {
        ele.classList.add("blink-text-pause");
      });
    }
  }
};