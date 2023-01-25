import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { addSong, removeSong, getFavoriteSongs } from '../services/favoriteSongsAPI';
import '../styles/musicCard.css';

class MusicCard extends Component {
  state = {
    isChecked: false,
    isLoading: false,
  };

  componentDidMount() {
    this.isChecked();
  }

  verifyCheckBox = async ({ target: { checked } }) => {
    const { song } = this.props;
    if (!checked) {
      await removeSong(song);
    } else {
      await addSong(song);
    }
  };

  isChecked = async () => {
    const { song } = this.props;
    const result = await getFavoriteSongs();
    const data = result.some((music) => music.trackId === song.trackId);
    this.setState({ isChecked: data });
  };

  render() {
    const { song } = this.props;
    const { isLoading, isChecked } = this.state;
    return (
      <div className="music-card" key={ song.trackId }>
        <p className="song-name">{ song.trackName }</p>
        <div className="song-div">
          <audio
            className="song-preview"
            data-testid="audio-component"
            src={ song.previewUrl }
            controls
          >
            <track kind="captions" />
            O seu navegador não suporta o elemento
            <code>audio</code>
          </audio>
          {
            isLoading
              ? (
                <div className="loading">Carregando...</div>
              ) : (
                <label htmlFor={ song.trackId }>
                  Favorita
                  <input
                    className="like-btn"
                    data-testid={ `checkbox-music-${song.trackId}` }
                    id={ song.trackId }
                    type="checkbox"
                    checked={ isChecked }
                    onChange={ (event) => {
                      this.setState({
                        isLoading: true,
                      }, async () => {
                        await this.verifyCheckBox(event);
                        await this.isChecked();
                        this.setState({ isLoading: false });
                      });
                    } }
                  />
                </label>
              )
          }
        </div>
      </div>
    );
  }
}

MusicCard.propTypes = {
  song: PropTypes.shape({
    trackId: PropTypes.number.isRequired,
    trackName: PropTypes.string.isRequired,
    previewUrl: PropTypes.string.isRequired,

  }).isRequired,
};

export default MusicCard;
