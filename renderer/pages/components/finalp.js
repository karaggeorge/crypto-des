import React from 'react';
import Block from './block';

import {getMessage, getBinary} from '../des';

const edit = (block, cb) => (index, newVal) => {
  block[index] = newVal;
  cb();
};

export default class FinalPermutation extends React.Component {
  static title = 'Final Permutation'
  render() {
    const {des} = this.props;

    return (
      <div className='container'>
        <h1>Final Permutation</h1>
        <h3>From the last step</h3>
        <Block name='L' sub='16' block={des.l[16]} onChange={edit(des.l[16], des.calcSwap)}/>
        <Block name='R' sub='16' block={des.r[16]} onChange={edit(des.r[16], des.calcSwap)}/>
        <h3>Swaping the two, we get</h3>
        <div>
          <span>R<sub>16</sub>L<sub>16</sub> = </span>
          <Block block={des.swap} onChange={edit(des.swap, des.calcCipher)}/>
        </div>
        <h3>Finally, performing the inverse of the initial permutation we get</h3>
        <Block name="c" block={des.cipher} onChange={edit(des.cipher, des.reset)}/>
        <h1>Turning it back into text</h1>
        <h3>Matching the character values we get</h3>
        <span>{getMessage(des.cipher.join(''))}</span>
      </div>
    );
  }
}
