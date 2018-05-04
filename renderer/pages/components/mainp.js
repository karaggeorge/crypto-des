import React from 'react';
import Block, {Bit} from './block';
import Header from './header';

const edit = (block, cb) => (index, newVal) => {
  block[index] = newVal;
  cb();
};

const Color = ({children, color}) => (
  <span>
    {children}
    <style jsx>{`
      color: ${color || 'auto'};
      font-weight: ${color ? 'bold' : 'normal'};
    `}</style>
  </span>
);

export default class Main extends React.Component {
  state = {
    step: 1,
  }

  render() {
    const {step} = this.state;
    const {des} = this.props;

    return (
      <div className="flex">
        <Header title={`Step ${step}`} nextStep={() => this.setState({step: step+1})} prevStep={() => this.setState({step: step-1})} min={1} max={16} cur={step}/>
        <div className="container flex">
          <h1>To find the key for the round:</h1>
          <h3>Starting with</h3>
          <Block name='C' sub={step-1} block={des.c[step-1]} onChange={edit(des.c[step-1], () => des.calcC(step))}/>
          <Block name='D' sub={step-1} block={des.d[step-1]} onChange={edit(des.d[step-1], () => des.calcD(step))}/>
          <h3>We shift each one to get</h3>
          <Block name='C' sub={step} block={des.c[step]} onChange={edit(des.c[step], () => des.calcD(step))}/>
          <Block name='D' sub={step} block={des.d[step]} onChange={edit(des.d[step], () => des.calcK(step))}/>
          <h3>And then apply the permutation to get the round key</h3>
          <Block name='K' sub={step} block={des.k[step]} split={6} onChange={edit(des.k[step], () => des.calcRound(step))}/>
          <h1>To compute the round</h1>
          <h3>We start with</h3>
          <div><span>L<sub>{step}</sub> = </span><Block name='R' sub={step-1} block={des.r[step-1]} center onChange={edit(des.r[step-1], () => des.calcRound(step))}/></div>
          <h3>To get R<sub>{step}</sub> we need to calculate L<sub>{step}</sub> ⊕ ƒ(R<sub>{step-1}</sub>, K<sub>{step}</sub>)</h3>
          <div className="steps">
            <div className="step">
              <h3>To calculate ƒ(R<sub>{step-1}</sub>, K<sub>{step}</sub>)</h3>
              <div className="steps">
                <div className="step">
                  <h3>First, we calculate E(R<sub>{step-1}</sub>)</h3>
                  <div><span>E(R<sub>{step-1}</sub>) = </span><Block block={des.er[step]} onChange={edit(des.er[step], () => des.calcErxork(step))}/></div>
                </div>
                <div className="step">
                  <h3>Then, E(R<sub>{step-1}</sub>) ⊕ K<sub>{step}</sub></h3>
                  <div className='addition'>
                    <div className='names'>
                      <span>E(R<sub>{step-1}</sub>)</span>
                      <span>K<sub>{step}</sub></span>
                      <span>E(R<sub>{step-1}</sub>) ⊕ K<sub>{step}</sub></span>
                    </div>
                    <div className='values'>
                      <Block block={des.er[step]} split={6} onChange={edit(des.er[step], () => des.calcErxork(step))}/>
                      <Block block={des.k[step]} split={6} onChange={edit(des.k[step], () => des.calcRound(step))}/>
                      <div/>
                      <Block block={des.erxork[step]} split={6} onChange={edit(des.erxork[step], () => des.calcBlocks(step))}/>
                    </div>
                  </div>
                </div>
                <div className="step">
                  <h3>Now, we work with the S-boxes</h3>
                  <table>
                    <thead>
                      <tr>
                        <th><i>i</i></th>
                        <th><strong>block</strong> <i>i</i></th>
                        <th><strong>Row (</strong>b<sub>1</sub>b<sub>6</sub><strong>)</strong></th>
                        <th><strong>Column (</strong>b<sub>2</sub>b<sub>3</sub>b<sub>4</sub>b<sub>5</sub><strong>)</strong></th>
                        <th><strong>Entry</strong></th>
                        <th><strong>Bits</strong></th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        des.blocks[step].map((x,i) => {
                          const row = des.rows[step][i];
                          const column = des.columns[step][i];
                          const entry = des.entries[step][i];
                          const bits = des.bits[step][i];

                          return (
                            <tr key={i}>
                              <td>{i+1}</td>
                              <td><Block block={x} split={x.length}/></td>
                              <td><Color color={row.color}>{row.dec}</Color> ({row.binary})</td>
                              <td><Color color={column.color}>{column.dec}</Color> ({column.binary})</td>
                              <td><Color color={entry.color}>{entry.val}</Color></td>
                              <td><Color color={bits.color}>{bits.val}</Color></td>
                            </tr>
                          );
                        })
                      }
                    </tbody>
                  </table>
                </div>
                <div className="step">
                  <h3>At this point we get</h3>
                  <span>C<sub>1</sub>C<sub>2</sub>C<sub>3</sub>C<sub>4</sub>C<sub>5</sub>C<sub>6</sub>C<sub>7</sub>C<sub>8</sub> = </span><Block block={des.cs[step]} onChange={edit(des.cs[step], () => des.calcFrk(step))}/>
                </div>
                <div className="step">
                  <h3>Applying the permutation we get</h3>
                  <span>ƒ(R<sub>{step-1}</sub>, K<sub>{step}</sub>) = </span><Block block={des.frk[step]} onChange={edit(des.frk[step], () => des.calcR(step))}/>
                </div>
              </div>
            </div>
            <div className="step">
              <h3>So, to compute R<sub>{step}</sub></h3>
              <div className='addition'>
                <div className='names'>
                  <span>L<sub>{step-1}</sub></span>
                  <span>ƒ(R<sub>{step-1}</sub>, K<sub>{step}</sub>)</span>
                  <span>L<sub>{step-1}</sub> ⊕ ƒ(R<sub>{step-1}</sub>, K<sub>{step}</sub>)</span>
                </div>
                <div className='values'>
                  <Block block={des.l[step-1]} onChange={edit(des.l[step-1], () => des.calcR(step))}/>
                  <Block block={des.frk[step]} onChange={edit(des.frk[step], () => des.calcR(step))}/>
                  <div/>
                  <Block block={des.r[step]} onChange={edit(des.r[step], () => des.calcRoundKey(step+1))}/>
                </div>
              </div>
            </div>
          </div>
          <h3>Therefore</h3>
          <Block name='L' sub={step} block={des.l[step]} />
          <Block name='R' sub={step} block={des.r[step]} />
        </div>

        <style jsx>{`
            .addition {
              display: flex;
            }

            .names {
              display: flex;
              flex-direction: column;
              text-align: right;
              padding-right: 8px;
              height: 72px;
              justify-content: space-around;
            }

            .values {
              display: flex;
              flex-direction: column;
              height: 72px;
              justify-content: space-around;
              padding-left: 8px;
            }

            .values div {
              height: 0;
              width: 100%;
              border-bottom: 1px solid black;
            }

            .steps {
              padding-left: 32px;
            }

            .step {
              padding-left: 32px;
            }

            .step h3 {
              margin-left: -32px;
            }

            table {
              border-collapse: collapse;
            }

            th, td {
              padding: 16px;
              border: 1px solid black;
              font-weight: normal;
              text-align: center;
            }
        `}</style>
      </div>
    )
  }

  static title = 'Main Process'
}
