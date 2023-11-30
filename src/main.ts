const area: HTMLDivElement = document.getElementById('area')! as HTMLDivElement;
const cells: HTMLCollectionOf<HTMLDivElement> = document.getElementsByClassName('cell') as HTMLCollectionOf<HTMLDivElement>;
const currentPlayer: HTMLSpanElement = document.getElementById('curPlyr') as HTMLSpanElement;

type Player = 'x' | 'o';

let player: Player = "x";

interface IStat {
	readonly xWins: number,
	readonly oWins: number,
	readonly draws: number,

    addWin(player: Player): void;
    addDraw(): void;
}

class Stat implements IStat {
    private _xWins: number;
	private _oWins: number;
	private _draws: number;
    
    public get xWins(): number {
        return this._xWins;
    }

    public set xWins(value: number) {
        this._xWins = value;
    }

    public get oWins(): number {
        return this._oWins;
    }

    public get draws(): number {
        return this._draws;
    }

    constructor() {
        this._xWins = 0;
        this._oWins = 0;
        this._draws = 0;
    }

    public addWin(player: Player): void {
        if (player === "x") { 
            this._xWins += 1;
        } else {
            this._oWins += 1;
        }
    }
    
    public addDraw(): void {
        this._draws += 1;
    }

}

const stat: IStat = new Stat();

type WinPositions = readonly [number, number, number];

const winIndex: readonly WinPositions[] = [
	[1,2,3],
	[4,5,6],
	[7,8,9],
	[1,4,7],
	[2,5,8],
	[3,6,9],
	[1,5,9],
	[3,5,7],
] as const;

for (let i: number = 1; i <= 9; i++) {
	area.innerHTML += "<div class='cell' pos=" + i + "></div>";
}

const cellsArray: HTMLDivElement[] = Array.from(cells);

cellsArray.forEach(cell => cell.addEventListener('click', createCellClicker(cell), false));

function newPlayer(player: Player): Player {
	return  player === "x" ? "o" : "x";
}

function setCurrentPlayer(player: Player): void {
	currentPlayer.innerHTML = player.toUpperCase();
}

function createCellClicker(cell: HTMLDivElement): EventListenerOrEventListenerObject {
    return () => cellClick(cell);
}

function cellClick(kletka: HTMLDivElement): void {

	const data: number[] = [];

	if (!kletka.innerHTML) {
		kletka.innerHTML = player;
	} else {
		alert("Ячейка занята");
		return;
	}

	cellsArray.forEach((cell: HTMLDivElement) =>
		cell.innerHTML === player && data.push(parseInt(cell.getAttribute('pos')!))
	)

	if (checkWin(data)) {
		stat.addWin(player);
		restart("Выиграл: " + player);
	} else {
		const draw: boolean = cellsArray.every(cell => cell.innerHTML !== '');

		if (draw) {
			stat.addDraw();
			restart("Ничья");
		}
	}

	player = newPlayer(player);
	setCurrentPlayer(player);
}

function checkWin(data): boolean {
	for (let i in winIndex) {
		let win = true;
		for (let j in winIndex[i]) {
			let id = winIndex[i][j];
			let ind = data.indexOf(id);

			if(ind == -1) {
				win = false
			}
		}

		if(win) return true;
	}

	return false;
}

function restart(text: string): void {

	alert(text);
	for(let i = 0; i < cells.length; i++) {
		cells[i].innerHTML = '';
	}
	updateStat();
}

function updateStat(): void {
	document.getElementById('sX')!.innerHTML = stat.xWins.toString();
	document.getElementById('sO')!.innerHTML = stat.oWins.toString();
	document.getElementById('sD')!.innerHTML = stat.draws.toString();
}