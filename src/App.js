import React, { Component } from 'react';
import { range } from 'lodash';
import createColorGradient from './create-color-gradient';
import InputRange from 'react-input-range';
import GitHubForkRibbon from 'react-github-fork-ribbon';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      time: Date.now(),
      resolution: 200,
      frequencyFactor: 0,
      phaseFactor: 10,
      modulationFactor: 6,
    };
  }

  componentDidMount() {
    this.startLoop();
  }

  componentWillUnmount() {
    this.stopLoop();
  }

  startLoop() {
    if(!this._frameId) {
      this._frameId = window.requestAnimationFrame(this.loop.bind(this));
    }
  }

  loop() {
    this.handleAnimation();
    this.frameId = window.requestAnimationFrame(this.loop.bind(this));
  }

  stopLoop() {
    window.cancelAnimationFrame(this._frameId);
  }

  handleAnimation() {
    this.setState({
      time: Date.now(),
    });
  }

  render() {
    const {
      time,
      resolution,
      frequencyFactor,
      phaseFactor,
      modulationFactor,
    } = this.state;

    const height = 50;

    const sineGradient = createColorGradient({
      frequencies: [5, 5, 5].map(factor => factor / resolution),
      phases: [0, 2, 4],
      length: resolution,
    });

    const tiles = range(resolution)
    .map((tile, index, array) => {
      const { length } = array;
      const color = sineGradient[index];
      const amplitude = height;

      const frequency = frequencyFactor / 100000;
      const modulation = 1 + (modulationFactor * (index / length));
      const phase = (phaseFactor * index / length) * Math.PI;
      const tileHeight = (amplitude * Math.sin(((2 * Math.PI) * (modulation * frequency * time)) + phase)) + amplitude;

      return (
        <div key={index} style={{
          height: `${Math.floor(tileHeight)}vh`,
          width: '100%',
          backgroundColor: color,
        }}></div>
      );
    });

    const headerText = 'ColorSine';

    const headerGradient = createColorGradient({
      frequencies: [0.3, 0.3, 0.3],
      phases: [0, 2, 4],
      length: headerText.length,
    })

    const header = (
      <h1 style={{ paddingBottom: 20 }}>
        {headerText.split('').map((letter, i) => (
          <span key={i} style={{ color: headerGradient[i] }}>{letter}</span>)
        )}
      </h1>
    );

    const toolbar = (
      <div style={{
        position: 'absolute',
        top: 15,
        right: 15,
        width: 300,
        paddingBottom: 50,
        paddingLeft: 50,
        paddingRight: 50,
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        borderRadius: 5,
      }}>
        <div style={{ width: '100%', padding: 20 }}>
          {header}
          <h3 style={{ paddingBottom: 10 }}>Resolution:</h3>
          <div>
            <InputRange
              maxValue={500}
              minValue={1}
              value={this.state.resolution}
              onChange={resolution => this.setState({ resolution })}
            />
          </div>
        </div>
        <div style={{ width: '100%', padding: 20 }}>
          <h3 style={{ paddingBottom: 10 }}>Speed:</h3>
          <div>
            <InputRange
              maxValue={500}
              minValue={0}
              value={this.state.frequencyFactor}
              onChange={frequencyFactor => this.setState({ frequencyFactor })}
            />
          </div>
        </div>
        <div style={{ width: '100%', padding: 20 }}>
          <h3 style={{ paddingBottom: 10 }}>Frequency:</h3>
          <div>
            <InputRange
              maxValue={100}
              minValue={0}
              value={this.state.phaseFactor}
              onChange={phaseFactor => this.setState({ phaseFactor })}
            />
          </div>
        </div>
        <div style={{ width: '100%', padding: 20 }}>
          <h3 style={{ paddingBottom: 10 }}>Modulation:</h3>
          <div>
            <InputRange
              maxValue={50}
              minValue={0}
              value={this.state.modulationFactor}
              onChange={modulationFactor => this.setState({ modulationFactor })}
            />
          </div>
        </div>
      </div>
    );

    const githubRibbon = (
      <GitHubForkRibbon
        href="https://github.com/eiriklv/colorsine"
        target="_blank"
        position="left"
        color="black"
      >
        Fork me on GitHub
      </GitHubForkRibbon>
    );

    return (
      <div style={{
        maxHeight: `100vh`,
        display: 'flex',
      }}>
        {tiles}
        {toolbar}
        {githubRibbon}
      </div>
    );
  }
}

export default App;
