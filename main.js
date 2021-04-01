const form = document.getElementById("form");
const nameInput = document.getElementById("name");
const artistInput = document.getElementById("artist");
const scoreText = document.getElementById("score");

let songs = [
	{
		link: "Memories.mp3",
		artist: ["maroon 5"],
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
		artist: ["lady gaga", "bradley cooper", "lady gaga and bradley cooper"],
		name: ["shallow"],
		answer: "Shallow by Lady Gaga",
	},
	{
		link: "Perfect.mp3",
		artist: ["ed sheeran"],
		name: ["perfect"],
		answer: "Perfect by Ed Sheeran",
	},
];
let finalGrid = [];
console.log(songs);
function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}
$(function () {
	$(".ui.grey.deny.button").click(() => {
		localStorage.setItem("doNotShow", "true");
	});
});
$(".github.icon").click(() => {
	window.open("https://github.com/emerzon1", "_blank");
});
$(function () {
	if (!localStorage.getItem("doNotShow")) {
		$(".test").modal("show");
		$(".test").modal({
			closable: true,
		});
	}
});
shuffleArray(songs);
let questionNumber = 0;
let score = 0;
const audio = document.getElementById("audio");
document.addEventListener("DOMContentLoaded", () => {
	audio.src = "songs/" + songs[questionNumber].link;
	audio.load();
	audio.play();
	$("#endScreen").toggle();
});
scoreText.textContent = score;

const createTable = () => {
	let res = "";
	for (let i = 0; i < finalGrid.length; i++) {
		res += `<div class="four column row">
                    <div class="ui header column">
                        <audio class="songWidth" src="songs/${finalGrid[i][0]}" controls>
                    </div>
                    <div class="ui header column">${finalGrid[i][1]}</div>
                    <div class="ui header column">${finalGrid[i][2]}</div>
                    <div class="ui header column">${finalGrid[i][3]}/3</div>
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
		if (songs[questionNumber].name.includes(name.toLowerCase())) {
			score += 2;
			addedScore += 2;
		}
		if (songs[questionNumber].artist.includes(artist.toLowerCase())) {
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
		console.log(finalGrid);
		audio.pause();
		scoreText.textContent = score;
		$("#form").toggle();
		$("#endScreen").append(createTable());
		$("#endScreen").toggle();
		return;
	}
	if (songs[questionNumber].name.includes(name.toLowerCase())) {
		score += 2;
		addedScore += 2;
	}
	if (songs[questionNumber].artist.includes(artist.toLowerCase())) {
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
	audio.src = "songs/" + songs[questionNumber].link;
	audio.load();
	audio.play();
});