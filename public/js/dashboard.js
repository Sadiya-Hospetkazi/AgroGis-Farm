// Load dashboard data
fetch("/api/dashboard", {
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token")
  }
})
.then(res => res.json())
.then(data => {
  document.getElementById("user").innerText = "Welcome " + data.user.name;
  
  let scoresHtml = "<h3>Scores:</h3><ul>";
  data.scores.forEach(score => {
    scoresHtml += `<li>${score.label}: ${score.value}</li>`;
  });
  scoresHtml += "</ul>";
  document.getElementById("scores").innerHTML = scoresHtml;
})
.catch(err => {
  console.error("Dashboard fetch error:", err);
  document.getElementById("user").innerText = "Failed to load dashboard data";
});