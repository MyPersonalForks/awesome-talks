import styled from 'styled-components'
import { Component } from 'preact'
import { Col } from 'react-styled-flexboxgrid'
import { graphql, compose } from 'react-apollo'
import randomID from 'random-id'
import Flex from 'styled-flex-component'
import { Link } from 'preact-router/match'
import YouTube from 'react-youtube'
import is from 'styled-is'
import ADD_FAVORITE from '../Queries/ADD_FAVORITE'
import REMOVE_FAVORITE from '../Queries/REMOVE_FAVORITE'
import GET_FAVORITES from '../Queries/GET_FAVORITES'
import ADD_WATCHED from '../Queries/ADD_WATCHED'
import REMOVE_WATCHED from '../Queries/REMOVE_WATCHED'
import GET_WATCHED from '../Queries/GET_WATCHED'
import Query from './Query'

const Button = styled.button`
  background: transparent;
  display: block;
  border: none;
  color: #f61c0d;
  font-weight: bold;
  text-align: right;
  padding: 0;
`

const Video = styled.section`
  position: relative;
  margin: auto;
`

const Speaker = styled.p`
  padding-left: 20px;
  a {
    min-width: 30px;
    display: block;
    padding: 5px;
    text-align: center;

    &:after {
      left: 0;
    }
  }
`

const Tag = styled(Link)`
  opacity: 1;
  border: none;
  opacity: 0.8;
  font-weight: 600;
  color: #000000;
  margin-top: -20px;
  padding: 0;
  margin-bottom: 10px;
  margin-right: 10px;

  &:hover {
    opacity: 1;
    color: #000000;
  }
  &:after {
    display: none;
  }
`

const Name = styled.h2`
  font-size: 400;
  font-size: 22px;
  color: #000000;
  letter-spacing: -0.63px;
`

const Description = styled.p`
  opacity: 0.8;
  font-family: Montserrat-Light;
  font-size: 14px;
  color: #000000;
  letter-spacing: 0.11px;
  line-height: 21px;
`

const Column = styled(Col)`
  transition: all 200ms ease;
  justify-content: center;
  margin: 0 auto;
  margin-bottom: 40px;
`
const Iframe = styled(YouTube)`
  position: relative;
  z-index: 3;
  border: none;
  transition: all 200ms ease;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1), 0 6px 6px rgba(0, 0, 0, 0.12);
`

const Thumbnail = styled.img`
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1), 0 6px 6px rgba(0, 0, 0, 0.12);
  display: block;
  width: 100%;

  ${is('isDescriptionClicked')`
    height: 500px;
  `};
`

const Image = styled.div`
  position: relative;
  margin: auto;
  height: 200px;
  overflow: hidden;
`

const Play = styled.button`
  background: #282828;
  border-radius: 50% / 10%;
  color: #ffffff;
  font-size: 1em;
  height: 3em;
  padding: 0;
  text-align: center;
  text-indent: 0.1em;
  transition: all 150ms ease-out;
  width: 4em;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  border: none;
  opacity: 0.8;
  cursor: pointer;

  &:hover {
    background: #ff0000;
  }

  &:before {
    background: inherit;
    border-radius: 5% / 50%;
    bottom: 9%;
    content: '';
    left: -5%;
    position: absolute;
    right: -5%;
    top: 9%;
  }

  &:after {
    border-style: solid;
    border-width: 1em 0 1em 1.732em;
    border-color: transparent transparent transparent rgba(255, 255, 255, 0.75);
    content: ' ';
    font-size: 0.75em;
    height: 0;
    margin: -1em 0 0 -0.75em;
    top: 50%;
    position: absolute;
    width: 0;
  }
`
const Heart = styled.div`
  position: absolute;
  z-index: 10;
  right: 10px;
  top: 10px;

  ${is('watched')`
      top: 50px;
  `};

  input[type='checkbox'] {
    clear: both;
    display: none;
  }

  input[type='checkbox'] {
    display: none;
  }

  input[type='checkbox'] + label {
    z-index: 100;
    overflow: hidden;
    text-align: center;
    cursor: pointer;
  }

  input[type='checkbox'] + label:before {
    content: '';
    z-index: -1;
    position: absolute;
    background: rgb(214, 214, 214);
    width: 100%;
    height: 100%;
    border-radius: 50%;
    top: 0;
    left: 0;
    transform: scale(0);
  }

  input[type='checkbox'] + label:after {
    content: '';
    z-index: -1;
    position: absolute;
    background: white;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    top: 0;
    left: 0;
    transform: scale(0);
  }

  input[type='checkbox']:checked + label svg {
    transition: all 300ms ease-in-out;
    fill: #ff0000;
    transform: scale(1.3);
  }

  input[type='checkbox']:checked + label svg g {
    fill: #51b257;
  }

  input[type='checkbox']:checked + label:after {
    animation: like-a 0.3s 0.2s both;
  }

  input[type='checkbox']:checked + label:before {
    animation: like-a 0.5s 0s both;
  }

  label svg,
  label g {
    display: inline-flex;
    vertical-align: middle;
    width: 35px;
    fill: rgb(214, 214, 214);
  }
`

const makeLink = (url = 'speaker', name = 'FIX ME') =>
  `/${url}/${name.replace(/\s+/g, '-').toLowerCase()}`

class VideoComposnent extends Component {
  state = { isDescriptionClicked: false, showVideo: false }

  toggleDescription = () =>
    this.setState(({ isDescriptionClicked }) => ({
      isDescriptionClicked: !isDescriptionClicked
    }))

  showVideo = () => {
    this.setState(({ showVideo }) => ({
      showVideo: !showVideo
    }))
    setTimeout(() => document.getElementById('iframe').playVideo(), 200)
  }

  render = (
    {
      speaker,
      description,
      link,
      name,
      tags,
      id,
      removeFavorite,
      addFavorite,
      removeWatched,
      addWatched
    },
    { isDescriptionClicked, showVideo }
  ) => (
    <Column
      md={isDescriptionClicked ? 12 : 4}
      sm={isDescriptionClicked ? 12 : 6}
      xs={9}
    >
      <Video>
        {showVideo ? (
          <Iframe
            videoId={link}
            id="iframe"
            onReady={e => e.target.playVideo()}
            opts={{
              width: '100%',
              height: isDescriptionClicked ? '500' : 180
            }}
          />
        ) : (
          <Image>
            <Play onClick={this.showVideo} />
            <Thumbnail
              isDescriptionClicked={isDescriptionClicked}
              src={`https://img.youtube.com/vi/${link}/mqdefault.jpg`}
              alt={name}
            />
            <Query query={GET_FAVORITES}>
              {({ data: { favorites } }) => {
                const inputId = randomID()
                return (
                  <Heart>
                    <input
                      checked={favorites.includes(id)}
                      type="checkbox"
                      id={inputId}
                      onClick={() =>
                        favorites.includes(id)
                          ? removeFavorite(id)
                          : addFavorite(id)
                      }
                    />
                    <label htmlFor={inputId}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 21.35l-1.45-1.32c-5.15-4.67-8.55-7.75-8.55-11.53 0-3.08 2.42-5.5 5.5-5.5 1.74 0 3.41.81 4.5 2.09 1.09-1.28 2.76-2.09 4.5-2.09 3.08 0 5.5 2.42 5.5 5.5 0 3.78-3.4 6.86-8.55 11.54l-1.45 1.31z" />
                      </svg>
                    </label>
                  </Heart>
                )
              }}
            </Query>
            <Query query={GET_WATCHED}>
              {({ data: { watched } }) => {
                const inputId = randomID()
                return (
                  <Heart watched>
                    <input
                      checked={watched.includes(id)}
                      type="checkbox"
                      id={inputId}
                      onClick={() =>
                        watched.includes(id)
                          ? removeWatched(id)
                          : addWatched(id)
                      }
                    />
                    <label htmlFor={inputId}>
                      <svg
                        width="90px"
                        height="24px"
                        viewBox="0 0 90 82"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g
                          id="Page-1"
                          stroke="none"
                          strokeWidth="1"
                          fill="none"
                          fillRule="evenodd"
                        >
                          <g fillRule="nonzero">
                            <path d="M88.937,1.152 C87.571,-0.221 85.181,-0.223 83.81,1.152 L60.393,24.569 L50.026,14.198 C48.652,12.822 46.261,12.828 44.899,14.194 C44.211,14.878 43.833,15.788 43.832,16.757 C43.832,17.727 44.209,18.64 44.897,19.326 L49.988,24.417 C49.988,24.417 56.527,30.732 57.94,32.146 C59.312,33.518 61.697,33.518 63.069,32.146 L73.438,21.777 L78.568,16.649 L88.935,6.279 C89.623,5.593 89.999,4.679 89.999,3.71 C89.999,2.742 89.621,1.832 88.937,1.152 Z" />
                            <path d="M36.656,33.607 C20.668,33.607 6.81,43.416 0,57.744 C6.81,72.072 20.668,81.879 36.656,81.879 C52.643,81.879 66.501,72.072 73.312,57.744 C66.501,43.416 52.644,33.607 36.656,33.607 Z M54.729,69.08 C49.316,72.717 43.067,74.641 36.656,74.641 C30.244,74.641 23.995,72.717 18.582,69.08 C14.274,66.186 10.625,62.309 7.884,57.744 C10.625,53.179 14.275,49.301 18.581,46.406 C23.994,42.769 30.243,40.847 36.655,40.847 C43.067,40.847 49.316,42.768 54.729,46.406 C59.037,49.301 62.688,53.178 65.428,57.744 C62.688,62.309 59.037,66.187 54.729,69.08 Z" />
                            <circle cx="36.656" cy="57.744" r="14.907" />
                          </g>
                        </g>
                      </svg>
                    </label>
                  </Heart>
                )
              }}
            </Query>
          </Image>
        )}
      </Video>

      <Flex justifyBetween alignCenter>
        <Name>{name}</Name>
        <Speaker>
          {speaker.map(s => (
            <Link
              key={s.id}
              activeClassName="active"
              href={makeLink(speaker.name)}
            >
              <span>{s.name}</span>
            </Link>
          ))}
        </Speaker>
      </Flex>
      <Flex>
        {tags.map(s => (
          <Tag
            key={s.id}
            activeClassName="active"
            href={makeLink('category', s.name)}
          >
            #{s.name.toLowerCase()}
          </Tag>
        ))}
      </Flex>

      {description ? (
        <Button onClick={this.toggleDescription}>
          {isDescriptionClicked ? 'Hide' : 'Show'} Description
        </Button>
      ) : null}

      {isDescriptionClicked && description ? (
        <Description>{description}</Description>
      ) : null}
    </Column>
  )
}

const VideoWrapper = compose(
  graphql(REMOVE_FAVORITE, {
    props: ({ mutate }) => ({
      removeFavorite: id => mutate({ variables: { id } })
    })
  }),
  graphql(ADD_FAVORITE, {
    props: ({ mutate }) => ({
      addFavorite: id => mutate({ variables: { id } })
    })
  }),
  graphql(REMOVE_WATCHED, {
    props: ({ mutate }) => ({
      removeWatched: id => mutate({ variables: { id } })
    })
  }),
  graphql(ADD_WATCHED, {
    props: ({ mutate }) => ({
      addWatched: id => mutate({ variables: { id } })
    })
  })
)(VideoComposnent)

export default VideoWrapper
