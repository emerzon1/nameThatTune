const form = document.getElementById("form");
const nameInput = document.getElementById("name");
const artistInput = document.getElementById("artist");
const scoreText = document.getElementById("score");
const personInput = document.getElementById("person");
let start = new Date().getTime();
let leaderboard;

let finalGrid = [];
$(".github.icon").click(() => {
	window.open("https://github.com/emerzon1", "_blank");
});
$(function () {
	if (getParameterByName("mode")) {
		$("#mainText").toggle();
		if (!localStorage.getItem("name")) {
			//$("#goBack").toggle();
			$("#form").toggle();
			$("#scoreContent").toggle();
		} else {
			$("#goBack").toggle();
		}
		$.ajax({
			url:
				"https://name-that-tune-leaderboard.herokuapp.com/?category=" +
				mode,
			type: "GET",
			success: (res) => {
				leaderboard = res;
			},
			error: (err) => {
				console.log(err);
			},
		});
	} else {
		if (getParameterByName("showLeaderboard")) {
			$("#form").toggle();
			$("#goBack").toggle();
			$("#endScreen").toggle();
			$("#scoreContent").toggle();
			$("#fullGrid").css("display", "none");
			$("#mainText").toggle();
			let modernLB;
			let lb2000;
			let lb1990;
			$("body").append(
				`<div class="ui middle aligned divided center aligned grid" id="leaderboard" style="margin-bottom: 0px">`
			);
			$.when(
				$.ajax({
					url:
						"https://name-that-tune-leaderboard.herokuapp.com/?category=modern",
					type: "GET",
					success: (res) => {
						modernLB = res;
					},
					error: (err) => {
						console.log(err);
					},
				}),
				$.ajax({
					url:
						"https://name-that-tune-leaderboard.herokuapp.com/?category=2000s",
					type: "GET",
					success: (res) => {
						lb2000 = res;
					},
					error: (err) => {
						console.log(err);
					},
				}),
				$.ajax({
					url:
						"https://name-that-tune-leaderboard.herokuapp.com/?category=1990s",
					type: "GET",
					success: (res) => {
						lb1990 = res;
					},
					error: (err) => {
						console.log(err);
					},
				})
			).then(() => {
				$("#leaderboard").append(`
                    <div class="five wide column">
                        <div class="ui header">
                            Modern Music Leaderboard
                            </div>
                            ${createLeaderboard(modernLB, false)}
                        
                    </div>`);
				$("#leaderboard").append(`
                    <div class="five wide column">
                        <div class="ui header">
                            2000s Music Leaderboard
                        </div>
                        ${createLeaderboard(lb2000, false)}
                        
                    </div>`);
				$("#leaderboard").append(`
                    <div class="five wide column">
                        <div class="ui header">
                            1990s Music Leaderboard
                            </div>
                            ${createLeaderboard(lb1990, false)}
                        
                    </div>`);
			});
			$("#leaderboard").append(`</div>`);
		} else {
			$("#form").toggle();
			$("#goBack").toggle();
			$("#endScreen").toggle();
			$("#scoreContent").toggle();
		}
	}
});
personInput.value = localStorage.getItem("name")
	? localStorage.getItem("name")
	: "";

personInput.addEventListener("change", (e) => {
	localStorage.setItem("name", e.target.value);
});

let questionNumber = 0;
let score = 0;
const audio = document.getElementById("audio");
document.addEventListener("DOMContentLoaded", () => {
	if (getParameterByName("mode")) {
		audio.src = "songs/" + songs[questionNumber].link;
		audio.load();
		audio.pause();
		$("#endScreen").toggle();
		$("#questionNum").text(questionNumber + 1);
	}
});
scoreText.textContent = score;
const mode = getParameterByName("mode");
let songs = allSongs[mode];
if (songs) {
	shuffleArray(songs);
}
const createTable = () => {
	let res = "";
	for (let i = 0; i < finalGrid.length; i++) {
		res += `<div class="four column row">
                    <div class="ui column">
                        <audio class="songWidth" src="songs/${finalGrid[i][0]}" controls>
                    </div>
                    <div class="ui column">${finalGrid[i][1]}</div>
                    <div class="ui column">${finalGrid[i][2]}</div>
                    <div class="ui column">${finalGrid[i][3]}/3</div>
		        </div>`;
	}
	return res;
};

form.addEventListener("submit", (e) => {
	e.preventDefault();
	let name = e.target[0].value;
	let artist = e.target[1].value;
	let addedScore = 0;
	if (questionNumber === Math.min(4, songs.length - 1)) {
		if (
			songs[questionNumber].name.some(
				(currentName) => distance(currentName, name.toLowerCase()) <= 2
			)
		) {
			score += 2;
			addedScore += 2;
		}
		if (
			songs[questionNumber].artist.some((currentArtist) =>
				distance(currentArtist, artist.toLowerCase())
			)
		) {
			score += 1;
			addedScore += 1;
		}

		finalGrid = finalGrid.concat([
			[
				songs[questionNumber].link,
				name + " by " + artist,
				songs[questionNumber].answer,
				addedScore,
			],
		]);
		if (localStorage.getItem("name")) {
			let elapsed = new Date().getTime() - start;
			let data = {
				name: localStorage.getItem("name"),
				score: score,
				category: mode,
				time: parseInt(elapsed / 1000),
			};
			leaderboard.push(data);
			leaderboard.sort((a, b) => {
				if (a.score != b.score) {
					return b.score - a.score;
				} else {
					return a.time - b.time;
				}
			});
			$.ajax({
				url: "https://name-that-tune-leaderboard.herokuapp.com/",
				type: "POST",
				data: data,
				dataType: "json",
				success: (res) => {
					console.log(res);
				},
				error: (err) => {
					console.log(err);
				},
			});
		}
		audio.pause();
		scoreText.textContent = score;
		$("#form").toggle();
		$("#endScreen").append(createTable());
		$("#fullGrid").append(createLeaderboard(leaderboard));
		$("#endScreen").toggle();
		return;
	}
	if (
		songs[questionNumber].name.some(
			(currentName) => distance(currentName, name.toLowerCase()) <= 2
		)
	) {
		score += 2;
		addedScore += 2;
	}
	if (
		songs[questionNumber].artist.some((currentArtist) =>
			distance(currentArtist, artist.toLowerCase())
		)
	) {
		score += 1;
		addedScore += 1;
	}
	scoreText.textContent = score;
	nameInput.value = "";
	artistInput.value = "";
	finalGrid = finalGrid.concat([
		[
			songs[questionNumber].link,
			name + " by " + artist,
			songs[questionNumber].answer,
			addedScore,
		],
	]);
	questionNumber++;
	$("#questionNum").text(questionNumber + 1);
	audio.src = "songs/" + songs[questionNumber].link;
	audio.load();
	audio.play();
});
