import { A } from '@solidjs/router';
import Cookies from 'js-cookie';
import { createSignal, onMount, Show } from 'solid-js';
import Card from '../components/Home/Card/Card';
import CustomButton from '../components/UI/CustomButton';
import Logo from '../components/UI/Logo';
import { ENDPOINTS } from '../constants/global';
import useCheckAuthentication from '../hooks/useCheckAuthentication';
import { useAuthContext } from '../store/auth-context';

const HomePage = () => {
  const [authState, { logout }] = useAuthContext();
  const logoutHandler = (): void => {
    logout();
  };

  onMount(() => {
    const handleClickScroll = () => {
      const element = document.getElementById('scroll-ref');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    const button = document.getElementById('scroll-button');
    button?.addEventListener('click', handleClickScroll);
    return () => {
      button?.removeEventListener('click', handleClickScroll);
    };
  });

  useCheckAuthentication();

  return (
    <>
      <section class="mx-16 my-8">
        <article class="flex justify-between ">
          <Logo size="small" />
          <div class="flex align items-center">
            <button
              id="scroll-button"
              class="focus:outline-none bg-primary-gray p-3 text-primary-orange rounded-2xl m-2"
            >
              Our Mission 🎯
            </button>
            <Show
              when={authState.isAuthenticated}
              fallback={
                <A
                  href={ENDPOINTS.REGISTER}
                  class="bg-primary-orange rounded-2xl p-3 text-white m-2"
                >
                  Join the squad! 💪
                </A>
              }
            >
              <CustomButton
                class="bg-primary-orange rounded-2xl p-3 text-white m-2"
                variant="primary"
                onClick={logoutHandler}
              >
                Logout
              </CustomButton>
            </Show>
          </div>
        </article>
        <article class="flex">
          <div class="flex basis-3/6 flex-col mt-16">
            <h1 class="font-Lexend font-black xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl text-8xl uppercase text-primary-purple">
              Benefits of making IRL Buddies
            </h1>
            <div class="flex items-center mb-2">
              <hr class="border-6 border-primary-purple w-2/4" />
              <p class="uppercase text-primary-orange ml-12 font-black text-2xl">
                What we do
              </p>
            </div>
            <p style={{ color: '#00000080' }} class="uppercase w-2/4">
              We enable people to make friendships while Participating in their
              favourite activity
            </p>
          </div>

          <div class="relative basis-3/6">
            <img src="../../src/assets/hero_image_stretching.svg"></img>
          </div>
        </article>
      </section>
      <section
        id="scroll-ref"
        class="m-16 mb-40 flex flex-col justify-center items-center"
      >
        <div class="my-20 max-w-3xl text-center">
          <h1 class="font-Lexend font-bold xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl text-6xl text-primary-purple">
            We're all about helping people get organized and have a
            <span class="text-primary-orange opacity-100 uppercase font-black drop-shadow tracking-wide">
              &nbsp;blast
            </span>
          </h1>
        </div>
        <div class="relative flex items-center justify-center">
          <div class="absolute -top-8 left-72 w-96 h-96 bg-primary-orange-complementary-2 rounded-full mix-blend-multiply filter blur-xl opacity-100 -z-10"></div>
          <div class="absolute -top-16 right-52 w-72 h-72 bg-primary-orange-complementary-1 rounded-full mix-blend-multiply filter blur-xl opacity-60 -z-10"></div>
          <div class="absolute -bottom-16 left-36 w-72 h-72 bg-primary-orange rounded-full mix-blend-multiply filter blur-xl opacity-60 -z-10"></div>
          <div class="absolute bottom-0 right-48 w-80 h-80 bg-primary-orange-complementary-3 rounded-full mix-blend-multiply filter blur-xl opacity-60 -z-10"></div>
          <div class="grid grid-cols-3 gap-5">
            <Card title="All your friends in one place 🫶">
              <p class="text-gray-700 text-base">
                Create groups, invite friends, and share events based on your
                interests. Organize new events and keep track of upcoming ones
                with ease. With our app, you'll never miss out on a sports event
                with your friends again.
              </p>
            </Card>
            <Card title="Groups for people with similar interests 👥">
              <p class="text-gray-700 text-base">
                Connect with people who share your sports interests. Join or
                create groups based on your favorite sports and get access to
                tailored events. Expand your network of sports enthusiasts,
                share experiences, and meet new people.
              </p>
            </Card>
            <Card title="Individual and organizational accounts 📒">
              <p class="text-gray-700 text-base">
                With our sports event organizing application, users can create
                both individual and organizational accounts, giving them access
                to a range of features that make event management and
                participation easy and efficient.
              </p>
            </Card>
            <Card title="Event management system with geolocation 📍">
              <p class="text-gray-700 text-base">
                SportsBuddy uses geolocation to help you find and create sports
                events nearby. This feature makes it easy for you to join events
                and for attendees to navigate to the location.
              </p>
            </Card>
            <Card title="Event attendance control 🔒">
              <p class="text-gray-700 text-base">
                Control your event attendance with SportsBuddy by setting
                participant limits and managing access through an approval
                system. You can also ensure organization and security by
                limiting the number of attendees.
              </p>
            </Card>
            <Card vibrantBackground={true}>
              <div class="flex flex-col">
                <div class="font-black mb-6 text-center text-3xl uppercase">
                  Join our community
                </div>
                <A
                  href={ENDPOINTS.REGISTER}
                  class="bg-primary-orange rounded-2xl p-3 text-white text-center m-4"
                >
                  Sign Up
                </A>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;

// style={'text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5)'
