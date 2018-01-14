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
      resolution: 50,
      frequencyFactor: 12,
      phaseFactor: 3,
      modulationFactor: 6,
      colorCenterFactor: 150,
      colorFrequency: [5, 5, 5],
      colorPhase: [0, 2, 4],
      showSettings: true,
      enableDouble: false,
      enableFlip: false,
    };

    this.toggleSettings = this.toggleSettings.bind(this);
  }

  componentDidMount() {
    this.startLoop();
    window.addEventListener('keypress', this.toggleSettings);
  }

  componentWillUnmount() {
    this.stopLoop();
    window.removeListener('keypress', this.toggleSettings);
  }

  toggleSettings(event) {
    switch (event.key) {
      case 's':
      return this.setState({
        showSettings: !this.state.showSettings,
      });

      case 'd':
      return this.setState({
        enableDouble: !this.state.enableDouble,
      });

      case 'f':
      return this.setState({
        enableFlip: !this.state.enableFlip,
      });

      default:
      break;
    }
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
      colorCenterFactor,
      colorFrequency: [
        redFrequency,
        greenFrequency,
        blueFrequency,
      ] = [],
      colorPhase: [
        redPhase,
        greenPhase,
        bluePhase,
      ] = [],
      showSettings,
      enableDouble,
      enableFlip,
    } = this.state;

    const height = 50;

    const sineGradient = createColorGradient({
      frequencies: [redFrequency, greenFrequency, blueFrequency].map(factor => factor / resolution),
      phases: [redPhase, greenPhase, bluePhase],
      length: resolution,
      center: colorCenterFactor,
    });

    const topTiles = range(resolution)
    .map((tile, index) => {
      const color = sineGradient[index];
      const amplitude = height;
      const frequency = frequencyFactor / 100000;
      const modulation = 1 + (modulationFactor * (index / resolution));
      const phase = (phaseFactor * index / resolution) * Math.PI;
      const tileHeight = (amplitude * Math.sin(((2 * Math.PI) * (modulation * frequency * time)) + phase)) + amplitude;
      const finalTileHeight = enableDouble ? tileHeight / 2 : tileHeight;

      return (
        <div key={index} style={{
          height: `50vh`,
          width: '100%',
          backgroundColor: color,
        }}>
          <div key={index} style={{
            height: enableFlip ? `${50 - finalTileHeight}vh` : `${finalTileHeight}vh`,
            width: '100%',
            backgroundColor: 'white',
          }}>

          </div>
        </div>
      );
    });

    const bottomTiles = range(resolution)
    .map((tile, index) => {
      const color = sineGradient[index];
      const amplitude = height;
      const frequency = frequencyFactor / 100000;
      const modulation = 1 + (modulationFactor * (index / resolution));
      const phase = (phaseFactor * index / resolution) * Math.PI;
      const tileHeight = (amplitude * Math.sin(((2 * Math.PI) * (modulation * frequency * time)) + phase)) + amplitude;
      const finalTileHeight = enableDouble ? tileHeight / 2 : tileHeight;

      return (
        <div key={index} style={{
          height: `${finalTileHeight}vh`,
          width: '100%',
          backgroundColor: color,
        }}></div>
      );
    });

    const headerText = 'ColorSine';

    const headerGradient = createColorGradient({
      frequencies: [0.3, 0.3, 0,3],
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
              maxValue={1000}
              minValue={1}
              step={1}
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
              step={1}
              value={this.state.frequencyFactor}
              onChange={frequencyFactor => this.setState({ frequencyFactor })}
            />
          </div>
        </div>
        <div style={{ width: '100%', padding: 20 }}>
          <h3 style={{ paddingBottom: 10 }}>Frequency:</h3>
          <div>
            <InputRange
              maxValue={500}
              minValue={0}
              step={1}
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
              step={1}
              value={this.state.modulationFactor}
              onChange={modulationFactor => this.setState({ modulationFactor })}
            />
          </div>
        </div>
        <div style={{ width: '100%', padding: 20 }}>
          <h3 style={{ paddingBottom: 10 }}>Color Brightness:</h3>
          <div>
            <InputRange
              maxValue={400}
              minValue={-150}
              step={1}
              value={this.state.colorCenterFactor}
              onChange={colorCenterFactor => this.setState({ colorCenterFactor })}
            />
          </div>
        </div>
        <div style={{ width: '100%', padding: 20 }}>
          <h3 style={{ paddingBottom: 10 }}>Color Frequency:</h3>
          <div style={{ paddingBottom: 40 }}>
            <InputRange
              maxValue={10}
              minValue={-10}
              step={0.1}
              value={this.state.colorFrequency[0]}
              onChange={colorFrequencyFactor => this.setState({
                colorFrequency: [
                  colorFrequencyFactor,
                  this.state.colorFrequency[1],
                  this.state.colorFrequency[2],
                ].map(freq => +(+freq).toFixed(1))
              })}
            />
          </div>
          <div style={{ paddingBottom: 40 }}>
            <InputRange
              maxValue={10}
              minValue={-10}
              step={0.1}
              value={this.state.colorFrequency[1]}
              onChange={colorFrequencyFactor => this.setState({
                colorFrequency: [
                  this.state.colorFrequency[0],
                  colorFrequencyFactor,
                  this.state.colorFrequency[2],
                ].map(freq => +(+freq).toFixed(1))
              })}
            />
          </div>
          <div style={{ paddingBottom: 0 }}>
            <InputRange
              maxValue={10}
              minValue={-10}
              step={0.1}
              value={this.state.colorFrequency[2]}
              onChange={colorFrequencyFactor => this.setState({
                colorFrequency: [
                  this.state.colorFrequency[0],
                  this.state.colorFrequency[1],
                  colorFrequencyFactor,
                ].map(freq => +(+freq).toFixed(1))
              })}
            />
          </div>
        </div>
        <div style={{ width: '100%', padding: 20 }}>
          <h3 style={{ paddingBottom: 10 }}>Color Phase:</h3>
          <div style={{ paddingBottom: 40 }}>
            <InputRange
              maxValue={10}
              minValue={-10}
              step={0.1}
              value={this.state.colorPhase[0]}
              onChange={colorPhaseFactor => this.setState({
                colorPhase: [
                  colorPhaseFactor,
                  this.state.colorPhase[1],
                  this.state.colorPhase[2],
                ].map(phase => +(+phase).toFixed(1))
              })}
            />
          </div>
          <div style={{ paddingBottom: 40 }}>
            <InputRange
              maxValue={10}
              minValue={-10}
              step={0.1}
              value={this.state.colorPhase[1]}
              onChange={colorPhaseFactor => this.setState({
                colorPhase: [
                  this.state.colorPhase[0],
                  colorPhaseFactor,
                  this.state.colorPhase[2],
                ].map(phase => +(+phase).toFixed(1))
              })}
            />
          </div>
          <div style={{ paddingBottom: 0 }}>
            <InputRange
              maxValue={10}
              minValue={-10}
              step={0.1}
              value={this.state.colorPhase[2]}
              onChange={colorPhaseFactor => this.setState({
                colorPhase: [
                  this.state.colorPhase[0],
                  this.state.colorPhase[1],
                  colorPhaseFactor,
                ].map(phase => +(+phase).toFixed(1))
              })}
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
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {enableDouble && (
          <div style={{
            height: `50vh`,
            display: 'flex',
            width: '100%'
          }}>
            {topTiles}
          </div>
        )}
        <div style={{
          height: enableDouble ? `50vh` : `100vh`,
          display: 'flex',
          width: '100%'
        }}>
          {bottomTiles}
        </div>
        {showSettings && toolbar}
        {showSettings && githubRibbon}
      </div>
    );
  }
}

export default App;
