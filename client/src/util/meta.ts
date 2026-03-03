export default class Meta {
	public leftA: number;
	public upA: number;
	public rightA: number;
	public hand: number[];
	public middle: number;

	constructor(l: number, u: number, r: number, h: number[], m: number) {
		this.leftA = l;
		this.upA = u;
		this.rightA = r;
		this.hand = h;
		this.middle = m;
	}
}
