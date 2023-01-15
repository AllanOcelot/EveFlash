<template>
  allan
  <div class="modal-container" :class="{active : visible}">
    <div class="info-modal">
      <div class="image">
        <div class="info">
          <p>Allan Antollare</p>
          <p>Smart | Sexy |  Poor</p>
        </div>
      </div>
      <div class="content">
        <h3>About</h3>
        <p>This was built to experiment with Vue3 and to give me something to do whilst Docked up. If you like it, consider donating some ISK to appear as a 'Sponsor'.</p>
        <hr>

        <h3>Friends</h3>
        <p>If you like this, why not check out...</p>
        <div class="friends">
          <a href="/">
            <span class="icon">
              <v-icon>
                mdi-twitch
              </v-icon>
            </span>
            <span class="desc">
              Vinnie Dooshay
            </span>
          </a>
          <a href="/">
            <span class="icon">
              <v-icon>
                mdi-twitch
              </v-icon>
            </span>
            <span class="desc">
              Vinnie Dooshay
            </span>
          </a>
          <a href="/">
            <span class="icon">
              <v-icon>
                mdi-twitch
              </v-icon>
            </span>
            <span class="desc">
              Vinnie Dooshay
            </span>
          </a>
        </div>
      </div>
      <div class="close" @click="$emit('closeModal')">
        Close
        <v-icon>
          mdi-close
        </v-icon>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
      }
    },
    props: ['visible'],
    methods: {
      closeModal(){

      }
    }
  }
</script>

<style lang="scss" scoped>
  .modal-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    background: rgba(0,0,0,0.8);
    align-items: center;
    justify-content: center;
    z-index: -1;
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s;


    &.active {
      z-index: 999;
      opacity: 1;
      pointer-events: inherit;
    }

    .info-modal {
      display: flex;
      flex-direction: row;
      background: #fff;
      min-height: 600px;
      max-width: 800px;
      position: relative;
      box-sizing: border-box;


      .close {
        position: absolute;
        top: -35px;
        right: 0;
        color: #fff;
        cursor: pointer;
        opacity: 0.7;
        transition: all 0.2s;
        i {
          margin-left: 5px;
        }

        &:hover {
          opacity: 1;
        }
      }

      .image {
        flex: 1 auto;
        width: 45%;
        display: block;
        background-color: #666;
        position: relative;
        background-image: url('/allan.png');
        background-size: cover;
        background-position: center center;
        background-repeat: no-repeat;
        .info {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 20px;
          border-top: 1px solid #f1f1f1;
          background: rgba(0,0,0,0.5);
          text-align: center;
          p {
            font-size: 14px;
            color: rgb(102, 161, 189);
            &:first-of-type {
              font-size: 20px;
              color: rgb(182, 173, 93);
            }
          }
        }
      }

      .content {
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;

        hr {
          margin: 30px 0;
          opacity: 0.5;
        }

        .friends {
          text-align: center;
          padding-top: 20px;
          a {
            text-decoration: none;
            display: inline-block;
            margin: 0 auto;
            padding: 0 20px;
            color: #2e272d;
            .icon {
              display: block;
              margin: 0 auto 5px auto;
              background: #f1f1f1;
              border-radius: 50%;
              width: 50px;
              height: 50px;
              list-style: 50px;
              i {
                line-height: 50px;
                height: 100%;
              }
            }
            .desc {
              text-align: center;
              width: 100%;
            }
            &:hover {
              color: #2d23c3;
              text-decoration: underline;
            }
          }
        }
      }
    }
  }
</style>
