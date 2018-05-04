import randomColor from 'randomcolor';

export const getBinary = m => m.split('').map(c => ('00000000' + c.charCodeAt(0).toString(2)).substr(-8)).join('');

export const getMessage = b => String.fromCharCode(...[...Array(b.length/8).keys()].map(i => parseInt(b.slice(i*8, (i+1)*8),2)));

const initPermutation = [58, 50, 42, 34, 26, 18, 10, 2, 60, 52, 44, 36, 28, 20, 12, 4, 62, 54, 46, 38, 30, 22, 14, 6, 64, 56, 48, 40, 32, 24, 16, 8, 57, 49, 41, 33, 25, 17, 9, 1, 59, 51, 43, 35, 27, 19, 11, 3, 61, 53, 45, 37, 29, 21, 13, 5, 63, 55, 47, 39, 31, 23, 15, 7];
const initKeyPermutation = [57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 16, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22, 14, 6, 61, 53, 45, 17, 29, 21, 13, 5, 28, 20, 12, 4];
const eofr = [32, 1, 2, 3, 4, 5, 4, 5, 6, 7, 8, 9, 8, 9, 10, 11, 12, 13, 12, 13, 14, 15, 16, 17, 16, 17, 18, 19, 20, 21, 20, 21, 22, 23, 24, 25, 24, 25, 26, 27, 28, 29, 28, 29, 30, 31, 32, 1];
const keyPermutation = [14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32];
const csPermutation = [16, 7, 20, 21, 29, 12, 28, 17, 1, 15, 23, 26, 5, 18, 31, 10, 2, 8, 24, 14, 32, 27, 3, 9, 19, 13, 30, 6, 22, 11, 4, 25];

const sBoxes = [
  [
    [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
    [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
    [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
    [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13]
  ], [
    [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
    [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
    [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
    [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9]
  ], [
    [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
    [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
    [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
    [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12]
  ], [
    [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
    [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
    [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
    [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14]
  ], [
    [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
    [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
    [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
    [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3]
  ], [
    [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
    [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
    [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
    [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13]
  ], [
    [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
    [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
    [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
    [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12]
  ], [
    [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
    [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
    [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
    [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11]
  ]
];

const xor = (a, b) => {
  return a.map((x,i) => ({
    code: (x.code ^ b[i].code).toString(),
    color: x.color || b[i].color,
  }));
};

export default class DES {
  constructor(message, key, reset) {
    this.message = message.split('').map(x => ({
      code: x,
    }));

    this.key = key.split('').map(x => ({
      code: x,
    }));

    this.reset = reset;
    this.ready = false;
    this.l = {};
    this.r = {};
    this.k = {};
    this.er = {};
    this.c = {};
    this.d = {};
    this.erxork = {};
    this.blocks = {};
    this.rows = {};
    this.columns = {};
    this.entries = {};
    this.bits = {};
    this.cs = {};
    this.frk = {};
    // this.encrypt();
  }

  start = (index, cb) => {
    this.cb = () => {
      this.ready = true;
      cb(index+1);
    };
    this.initPermute();
    // this.encrypt(() => {
    //   this.ready = true;
    //   cb(index+1);
    // });
  }

  encrypt = cb => {
    // this.initialPermutation = this.initPermute();
    //
    //
    //
    // for(var i = 1;i <= 16;i++) {
    //   this.calculateKey(i);
    //   this.calculateStep(i);
    // }
    const swap = [...this.r[16], ...this.l[16]];
    this.cipher = [...Array(64).keys()].map(x => swap[initPermutation.indexOf(x+1)]);
    cb();
  }

  initPermute = () => {
    this.initialPermutation = [...Array(64).keys()].map(x => this.message[initPermutation[x]-1]);
    this.fl();
  }

  fl = () => {
    this.l[0] = this.initialPermutation.slice(0, 32);
    this.fr();
  }

  fr = () => {
    this.r[0] = this.initialPermutation.slice(32);
    this.initKeyPermute();
  }

  initKeyPermute = () => {
    this.initialKeyPermutation = [...Array(56).keys()].map(x => this.key[initKeyPermutation[x]-1]);
    this.fc();
  }

  fc = () => {
    this.c[0] = this.initialKeyPermutation.slice(0, 28);
    this.fd();
  }

  fd = () => {
    this.d[0] = this.initialKeyPermutation.slice(28);
    this.calcRoundKey(1);
  }

  calcRoundKey = s => {
    this.calcC(s);
  }

  shiftLeft = (s, p) => {
    const shiftAmount = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1][s-1];

    return [...p.slice(shiftAmount), ...p.slice(0, shiftAmount)];
  }

  calcC = s => {
    this.c[s] = this.shiftLeft(s, this.c[s-1]);
    this.calcD(s);
  }

  calcD = s => {
    this.d[s] = this.shiftLeft(s, this.d[s-1]);
    this.calcK(s);
  }

  calcK = s => {
    const cd = [...this.c[s], ...this.d[s]];
    this.k[s] = [...Array(48).keys()].map(x => cd[keyPermutation[x] - 1]);
    this.calcRound(s);
  }

  calcRound = s => {
    this.calcL(s);
  }

  calcL = s => {
    this.l[s] = this.r[s-1];
    this.calcER(s);
  }

  calcER = s => {
    this.er[s] = [...Array(48).keys()].map(x => this.r[s-1][eofr[x]-1]);
    this.calcErxork(s);
  }

  calcErxork = s => {
    this.erxork[s] = xor(this.er[s], this.k[s]);
    this.calcBlocks(s);
  }

  calcBlocks = s => {
    this.blocks[s] = [...Array(8).keys()].map(x => this.erxork[s].slice(x*6, (x+1)*6));
    this.calcRows(s);
  }

  calcRows = s => {
    this.rows[s] = this.blocks[s].map(x => ({
      binary: x[0].code+x[5].code,
      dec: parseInt(x[0].code+x[5].code, 2),
      color: x[0].color || x[5].color
    }));
    this.calcColumns(s);
  }

  calcColumns = s => {
    this.columns[s] = this.blocks[s].map(x => ({
      binary: x[1].code+x[2].code+x[3].code+x[4].code,
      dec: parseInt(x[1].code+x[2].code+x[3].code+x[4].code, 2),
      color: x[1].color || x[2].color || x[3].color || x[4].color
    }));
    this.calcEntries(s);
  }

  calcEntries = s => {
    this.entries[s] = this.blocks[s].map((x,i) => ({
      val: sBoxes[i][this.rows[s][i].dec][this.columns[s][i].dec],
      color: this.rows[s][i].color || this.columns[s][i].color
    }));
    this.calcBits(s);
  }

  calcBits = s => {
    this.bits[s] = this.entries[s].map(x => ({
      val: ('0000' + x.val.toString(2)).substr(-4),
      color: x.color
    }));
    this.calcCs(s);
  }

  calcCs = s => {
    this.cs[s] = this.bits[s].map(x => x.val.split('').map(y => ({code: y, color: x.color}))).reduce((res, x) => [...res, ...x], []);
    this.calcFrk(s);
  }

  calcFrk = s => {
    this.frk[s] = [...Array(32).keys()].map(x => this.cs[s][csPermutation[x] - 1]);
    this.calcR(s);
  }

  calcR = s => {
    this.r[s] = xor(this.l[s-1], this.frk[s]);
    if (s === 16) {
      this.calcSwap();
    } else {
      this.calcRoundKey(s+1);
    }
  }

  calcSwap = () => {
    this.swap = [...this.r[16], ...this.l[16]];
    this.calcCipher();
  }

  calcCipher = () => {
    this.cipher = [...Array(64).keys()].map(x => this.swap[initPermutation.indexOf(x+1)]);
    if (this.cb) {
      this.cb();
      delete this.cb;
    } else {
      this.reset();
    }
  }



  // calculateStep = s => {
  //
  //   this.r[s] = xor(this.l[s-1], this.f(s, this.r[s-1], this.k[s]));
  // }
  //
  // f = (s, r, k) => {
  //   this.er[s] = [...Array(48).keys()].map(x => r[eofr[x]-1]);
  //   this.erxork[s] = xor(this.er[s], this.k[s]);
  //
  //   this.blocks[s] = [...Array(8).keys()].map(x => this.erxork[s].slice(x*6, (x+1)*6));
  //   this.rows[s] = this.blocks[s].map(x => ({
  //     binary: x[0].code+x[5].code,
  //     dec: parseInt(x[0].code+x[5].code, 2),
  //     color: x[0].color || x[5].color
  //   }));
  //   this.columns[s] = this.blocks[s].map(x => ({
  //     binary: x[1].code+x[2].code+x[3].code+x[4].code,
  //     dec: parseInt(x[1].code+x[2].code+x[3].code+x[4].code, 2),
  //     color: x[1].color || x[2].color || x[3].color || x[4].color
  //   }));
  //
  //   this.entries[s] = this.blocks[s].map((x,i) => ({
  //     val: sBoxes[i][this.rows[s][i].dec][this.columns[s][i].dec],
  //     color: this.rows[s][i].color || this.columns[s][i].color
  //   }));
  //   this.bits[s] = this.entries[s].map(x => ({
  //     val: ('0000' + x.val.toString(2)).substr(-4),
  //     color: x.color
  //   }));
  //
  //   this.cs[s] = this.bits[s].map(x => x.val.split('').map(y => ({code: y, color: x.color}))).reduce((res, x) => [...res, ...x], []);
  //   this.frk[s] = [...Array(32).keys()].map(x => this.cs[s][csPermutation[x] - 1]);
  //   return this.frk[s];
  // }
}
