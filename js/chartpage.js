// https://jp.vuejs.org/v2/examples/todomvc.html
var STORAGE_KEY = 'chart-data';
var cfStorage = {
  fetch: function() {
    var problems = {};
    for (let i = 0; i <= 4000; i += 100) {
      problems[i] = localStorage.getItem("pr"+i.toString());
    }
    return problems;
  },
  save: function(problems) {
    for(let i=0; i<=4000; i+=100){
      localStorage.setItem("pr"+i.toString(), problems[i]);
    }
  }
};

var solvedStorage = {
  fetch: function() {
    var solved = {};
    for(let i=0; i<=4000; i+=100){
      solved[i] = localStorage.getItem("slvd"+i.toString());
    }
    return solved;
  },
  save : function(subs) {
    for(let i=0; i<=4000; i+=100){
      let solved = subs[i].length;
      localStorage.setItem("slvd"+i.toString(), solved);
    }
  }
};

var app = new Vue({
  el: '#app',
  data: {
    subs: {},
    problems: {},
    solved: {},
  },
  computed: {

  },
  methods: {
    updateSubmissions: function() {
      let url = "https://codeforces.com/api/user.status?handle=springroll";
      //console.log(url);
      for(let i=0; i<=4000; i+=100) this.subs[i] = [];
      axios.get(url).then(function(data) {
        console.log("axios.get: updateSubmissions");
        if(data.data.result==null){
          return;
        }
        let json = data.data.result;
        for(let i=0; i<json.length; i++) {
          if (json[i].verdict !== "OK" || json[i].testset !== "TESTS") continue;
          let problemName = json[i].problem.name;
          let problemRating = json[i].problem.rating;
          app.subs[problemRating].push(problemName);
        }
        for(let i=0; i<=4000; i+=100){
          app.subs[i] = app.subs[i].filter((sub, index, array) => {
		    		return array.indexOf(sub) === index;
					});
          app.solved[i] = app.subs[i].length;
				}
        console.log("done.");
      }).catch(error => alert("Failed."))
          .finally(() => solvedStorage.save(app.subs));
    },
    updateProblems: function() {
      let url = "https://codeforces.com/api/problemset.problems";
      axios.get(url).then(function(data) {
        console.log("axios.get: updateProblems");
        console.log(data);
        let json = data.data.result.problems;
        for(let i=0; i<json.length; i++){
          problem = json[i];
          if(!problem.rating) continue;
          if(!app.problems[problem.rating]) app.problems[problem.rating] = 0;
          app.problems[problem.rating]++;
        }
      }).catch(error => console.log(error))
          .finally(() => cfStorage.save(app.problems))
    }
  },
  mounted() {
    this.updateSubmissions();
    if($.cookie("access") === undefined){
      this.updateProblems();
    }
    this.problems = cfStorage.fetch();
    this.solved = solvedStorage.fetch();
  },
});


/* Chart.jsを用いた円グラフの描画 */
var ctx15 = document.getElementById('df15');
var df15ch = new Chart(ctx15, {
  type: 'pie',
  data: {
    labels: ["Unsolved", "Solved"],
    datasets: [{
      backgroundColor: [
          "#666",
          "#00ce00"
      ],
      data: [app.problems[1500]-app.solved[1500],app.solved[1500]]
    }]
  },
  options: {
    title: {
      display: true,
      text: 'Difficulty 1500',
      fontSize: 18,
    },
    rotation: 0,
    animation: {
      animateScale: true
    },
  }
});
var ctx16 = document.getElementById('df16');
var df16ch = new Chart(ctx16, {
  type: 'pie',
  data: {
    labels: ["Unsolved", "Solved"],
    datasets: [{
      backgroundColor: [
          "#666",
          "#00ce00",
      ],
      data: [app.problems[1600]-app.solved[1600], app.solved[1600]]
    }]
  },
  options: {
    title: {
      display: true,
      text: 'Difficulty 1600',
      fontSize: 18,
    },
    rotation: 0,
    animation: {
      animateScale: true
    },
  }
});
var ctx17 = document.getElementById('df17');
var df17ch = new Chart(ctx17, {
  type: 'pie',
  data: {
    labels: ["Unsolved", "Solved"],
    datasets: [{
      backgroundColor: [
          "#666",
          "#00ce00"
      ],
      data: [app.problems[1700]-app.solved[1700],app.solved[1700]]
    }]
  },
  options: {
    title: {
      display: true,
      text: 'Difficulty 1700',
      fontSize: 18,
    },
    rotation: 0,
    animation: {
      animateScale: true
    },
  }
});