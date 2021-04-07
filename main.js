const form = document.getElementById("form");
const nameInput = document.getElementById("name");
const artistInput = document.getElementById("artist");
const scoreText = document.getElementById("score");
const personInput = document.getElementById("person");
let start = new Date().getTime();
let leaderboard;
const shuffleArray = (array) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
};
const getParameterByName = (name, url = window.location.href) => {
	name = name.replace(/[\[\]]/g, "\\$&");
	let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return "";
	return decodeURIComponent(results[2].replace(/\+/g, " "));
};
const _min = (d0, d1, d2, bx, ay) => {
	return d0 < d1 || d2 < d1
		? d0 > d2
			? d2 + 1
			: d0 + 1
		: bx === ay
		? d1
		: d1 + 1;
};
//edit distance
const distance = (a, b) => {
	if (a === b) {
		return 0;
	}

	if (a.length > b.length) {
		var tmp = a;
		a = b;
		b = tmp;
	}

	var la = a.length;
	var lb = b.length;

	while (la > 0 && a.charCodeAt(la - 1) === b.charCodeAt(lb - 1)) {
		la--;
		lb--;
	}

	var offset = 0;

	while (offset < la && a.charCodeAt(offset) === b.charCodeAt(offset)) {
		offset++;
	}

	la -= offset;
	lb -= offset;

	if (la === 0 || lb < 3) {
		return lb;
	}

	var x = 0;
	var y;
	var d0;
	var d1;
	var d2;
	var d3;
	var dd;
	var dy;
	var ay;
	var bx0;
	var bx1;
	var bx2;
	var bx3;

	var vector = [];

	for (y = 0; y < la; y++) {
		vector.push(y + 1);
		vector.push(a.charCodeAt(offset + y));
	}

	var len = vector.length - 1;

	for (; x < lb - 3; ) {
		bx0 = b.charCodeAt(offset + (d0 = x));
		bx1 = b.charCodeAt(offset + (d1 = x + 1));
		bx2 = b.charCodeAt(offset + (d2 = x + 2));
		bx3 = b.charCodeAt(offset + (d3 = x + 3));
		dd = x += 4;
		for (y = 0; y < len; y += 2) {
			dy = vector[y];
			ay = vector[y + 1];
			d0 = _min(dy, d0, d1, bx0, ay);
			d1 = _min(d0, d1, d2, bx1, ay);
			d2 = _min(d1, d2, d3, bx2, ay);
			dd = _min(d2, d3, dd, bx3, ay);
			vector[y] = dd;
			d3 = d2;
			d2 = d1;
			d1 = d0;
			d0 = dy;
		}
	}

	for (; x < lb; ) {
		bx0 = b.charCodeAt(offset + (d0 = x));
		dd = ++x;
		for (y = 0; y < len; y += 2) {
			dy = vector[y];
			vector[y] = dd = _min(dy, d0, dd, bx0, vector[y + 1]);
			d0 = dy;
		}
	}

	return dd;
};
const createLeaderboard = (lb, header = true) => {
	let res = `<div class="eight wide column">
                ${header ? `<h1 class="ui header">Leaderboard</h1>` : ``}
                <div class="ui middle aligned center aligned grid">
                    <div class="four column row">
                        <div class="ui header column">Place</div>
                        <div class="ui header column">Name</div>
                        <div class="ui header column">Score</div>
                        <div class="ui header column">Time (seconds)</div>
                    </div>`;
	for (let i = 0; i < Math.min(10, lb.length); i++) {
		res += `<div class="four column row">
                    <div class="ui column">${i + 1}</div>
                    <div class="ui column">${lb[i].name}</div>
                    <div class="ui column">${lb[i].score}</div>
                    <div class="ui column">${lb[i].time}</div>
                </div>`;
	}

	header
		? (res += `</div></div><div class="ui vertical divider">and</div>`)
		: (res += "");
	return res;
};
const allSongs = {
	modern: [
		{
			link: "Memories.mp3",
			artist: ["maroon 5", "maroon five"],
			name: ["memories"],
			answer: "Memories by Maroon 5",
		},
		{
			link: "Happier.mp3",
			artist: ["bastille", "marshmello"],
			name: ["happier"],
			answer: "Happier by Bastille (and Marshmello)",
		},
		{
			link: "SomeoneYouLoved.mp3",
			artist: ["lewis capaldi"],
			name: ["someone you loved"],
			answer: "Someone You Loved by Lewis Capaldi",
		},
		{
			link: "StoryOfMyLife.mp3",
			artist: ["one direction"],
			name: ["story of my life"],
			answer: "Story of My Life by One Direction",
		},
		{
			link: "Sunflower.mp3",
			artist: ["post malone", "swae lee"],
			name: [
				"sunflower",
				"spider man",
				"spider man: into the spider verse",
				"spider man into the spider verse",
				"spider man into the spider-verse",
				"spider man into the spider-verse",
				"sunflower (spider-man: into the spider-verse)",
			],
			answer: "Sunflower by Post Malone (and Swae Lee)",
		},
		{
			link: "Ransom.mp3",
			artist: ["lil tecca", "tecca"],
			name: ["ransom"],
			answer: "Ransom by Lil Tecca",
		},
		{
			link: "Shallow.mp3",
			artist: [
				"lady gaga",
				"bradley cooper",
				"lady gaga and bradley cooper",
			],
			name: ["shallow"],
			answer: "Shallow by Lady Gaga",
		},
		{
			link: "Perfect.mp3",
			artist: ["ed sheeran"],
			name: ["perfect"],
			answer: "Perfect by Ed Sheeran",
		},
	],
	"2000s": [
		{
			link: "PokerFace.mp3",
			artist: ["lady gaga"],
			name: ["poker face"],
			answer: "Poker Face by Lady Gaga",
		},
		{
			link: "Umbrella.mp3",
			artist: ["rihanna"],
			name: ["umbrella"],
			answer: "Umbrella by Rihanna",
		},
		{
			link: "SinceYouBeenGone.mp3",
			artist: ["kelly clarkson"],
			name: [
				"since you been gone",
				"since u been gone",
				"since you've been gone",
			],
			answer: "Since U Been Gone by Kelly Clarkson",
		},
		{
			link: "LoseYourself.mp3",
			artist: ["eminem"],
			name: ["lose yourself"],
			answer: "Lose Yourself by Eminem",
		},
		{
			link: "CrazyInLove.mp3",
			artist: ["beyonce"],
			name: ["crazy in love"],
			answer: "Crazy in Love by Beyonce",
		},
		{
			link: "IKissedAGirl.mp3",
			artist: ["katy perry"],
			name: ["i kissed a girl"],
			answer: "I Kissed a Girl by Katy Perry",
		},
		{
			link: "YouBelongWithMe.mp3",
			artist: ["taylor swift"],
			name: ["you belong with me"],
			answer: "You Belong With Me by Taylor Swift",
		},
		{
			link: "MrBrightside.mp3",
			artist: ["the killers", "killers"],
			name: ["mr. brightside", "mr brightside"],
			answer: "",
		},
		{
			link: "Zombie.mp3",
			artist: ["the cranberries", "cranberries"],
			name: ["zombie"],
			answer: "Zombie by The Cranberries",
		},
	],
	"1990s": [
		{
			link: "BabyOneMoreTime.mp3",
			artist: ["britney spears"],
			name: ["baby one more time", "hit me baby one more time"],
			answer: "Baby One More Time by Britney Spears",
		},
		{
			link: "UnbreakMyHeart.mp3",
			artist: ["toni braxton"],
			name: ["unbreak my heart", "un-break my heart"],
			answer: "Un-Break My Heart by Toni Braxton",
		},
		{
			link: "IWantItThatWay.mp3",
			artist: ["backstreet boys"],
			name: ["i want it that way"],
			answer: "I Want It That Way by Backstreet Boys",
		},
		{
			link: "Wonderwall.mp3",
			artist: ["oasis"],
			name: ["wonder wall", "wonderwall"],
			answer: "Wonderwall by Oasis",
		},
		{
			link: "LifeIsAHighway.mp3",
			artist: ["tom cochrane"],
			name: ["life is a highway"],
			answer: "Life is a Highway by Tom Cochrane",
		},
	],
};

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
