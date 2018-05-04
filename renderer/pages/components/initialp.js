import React from 'react';
import Block from './block';

const edit = (block, cb) => (index, newVal) => {
  block[index] = newVal;
  cb();
};

export default class InitialPermutation extends React.Component {

  render() {
    const {des, message} = this.props;

    return (
      <div className="container flex">
        <h1>First, we turn the message into binary</h1>
        <h3>From the message</h3>
        <div>{message}</div>
        <h3>We get</h3>
        <Block name='m' block={des.message} onChange={edit(des.message, des.initPermute)}/>
        <h1>Initial Message Permutation</h1>
        <h3>From the initial message</h3>
        <Block name='m' block={des.message} onChange={edit(des.message, des.initPermute)}/>

        <h3>We get the permutation</h3>
        <Block name='m' sub="0" block={des.initialPermutation} onChange={edit(des.initialPermutation, des.fl)}/>

        <h3>And then split it into two parts</h3>
        <Block name='L' sub="0" block={des.l[0]} onChange={edit(des.l[0], des.fr)}/>
        <Block name='R' sub='0' block={des.r[0]} onChange={edit(des.r[0], des.initKeyPermute)}/>
        <h1>Finding C<sub>0</sub> and D<sub>0</sub></h1>
        <h3>Starting with the initial key</h3>
        <Block name='K' block={des.key} onChange={edit(des.key, des.initKeyPermute)}/>
        <h3>We get the initial permutation</h3>
        <Block name='K' sub='0' block={des.initialKeyPermutation} onChange={edit(des.initialKeyPermutation, des.fc)}/>
        <h3>And spliting that, we get</h3>
        <Block name='C' sub='0' block={des.c[0]} onChange={edit(des.c[0], des.fd)}/>
        <Block name='D' sub='0' block={des.d[0]} onChange={edit(des.d[0], () => des.calcRoundKey(1))}/>
      </div>
    )
  }

  static title = 'Initial Permutation'
}
