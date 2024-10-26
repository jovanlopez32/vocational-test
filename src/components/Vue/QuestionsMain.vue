<script setup>
import { onMounted, ref, computed } from 'vue';
import areasData from '../../assets/data/areasdata.json';
import questionsData from '../../assets/data/questionsdata.json';
import { navigate } from 'astro:transitions/client';

// Constants
const QUESTIONS_PER_PAGE = 3;
const TOTAL_QUESTIONS = questionsData.preguntas.length;
const TOTAL_PAGES = Math.ceil(TOTAL_QUESTIONS / QUESTIONS_PER_PAGE) + 4;
// Calculate page positions for motivational messages
const QUARTER_PAGE = Math.ceil(TOTAL_PAGES * 0.25);
const HALF_PAGE = Math.ceil(TOTAL_PAGES * 0.5);
const THREE_QUARTERS_PAGE = Math.ceil(TOTAL_PAGES * 0.75);

console.log(TOTAL_QUESTIONS);
console.log(TOTAL_PAGES);
console.log(QUARTER_PAGE);
console.log(HALF_PAGE);
console.log(THREE_QUARTERS_PAGE);
// State management
const userData = ref('');
const questions = ref([]);
const currentPage = ref(1);
const areaResults = ref({});
const sliderData = ref([]);

// Motivational pages configuration
const motivationalPages = {
  [QUARTER_PAGE]: {
    title: "Great Progress!",
    message: "You have completed a quarter of the test. Your honesty in each response helps us understand you better. Keep it up!",
    image: "🌱"
  },
  [HALF_PAGE]: {
    title: "You're Halfway There!",
    message: "Fantastic! You've reached the halfway point of the test. Every response helps us build a unique profile, as unique as you. Let's keep going!",
    image: "🌟"
  },
  [THREE_QUARTERS_PAGE]: {
    title: "The Goal is Getting Closer!",
    message: "Incredible! You've completed three-quarters of the test. Your dedication in each response is paying off. We're almost there!",
    image: "✨"
  }
};

// Initialize area results
const initializeAreaResults = () => {
  areasData.areas.forEach(area => {
    areaResults.value[area.name] = {
      interested: 0,
      notInterested: 0
    };
  });
};

// Shuffle questions and add necessary properties
const shuffleQuestions = () => {
  const shuffled = questionsData.preguntas
    .map(question => ({
      ...question,
      selected: null,
      order: Math.random()
    }))
    .sort((a, b) => a.order - b.order);

  questions.value = shuffled;
};

// Pagination logic
const calculatedTotalPages = computed(() => Math.ceil(questions.value.length / QUESTIONS_PER_PAGE) + 4);  // +1 for the welcome page

const isMotivationalPage = computed(() => {
  return Object.keys(motivationalPages).includes(currentPage.value.toString());
});

const currentQuestions = computed(() => {
  if (isMotivationalPage.value) return [];

  let adjustedPage = currentPage.value;
  // Adjust page number to account for motivational pages
  if (currentPage.value > QUARTER_PAGE) adjustedPage--;
  if (currentPage.value > HALF_PAGE) adjustedPage--;
  if (currentPage.value > THREE_QUARTERS_PAGE) adjustedPage--;


  const start = (adjustedPage - 2) * QUESTIONS_PER_PAGE;  // -1 for the welcome page
  const end = start + QUESTIONS_PER_PAGE;
  return questions.value.slice(start, end);
});

const isFirstPage = computed(() => currentPage.value === 1);
const isLastPage = computed(() => currentPage.value === calculatedTotalPages.value);

// Navigation methods
const nextPage = () => {
  if (currentPage.value < calculatedTotalPages.value) {
    currentPage.value++;
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// Question handling
const handleSelection = (questionId, value) => {
  const question = questions.value.find(q => q.id === questionId);
  if (question) {
    question.selected = question.selected === value ? null : value;
    updateAreaCounters();
  }
};

// Area results management
const updateAreaCounters = () => {
  initializeAreaResults();

  questions.value.forEach(question => {
    if (question.selected !== null) {
      const area = findQuestionArea(question.id);
      if (area) {
        const counter = question.selected ? 'interested' : 'notInterested';
        areaResults.value[area.name][counter]++;
      }
    }
  });
};

const findQuestionArea = (questionId) => {
  return areasData.areas.find(area =>
    area.questionsGroup.includes(questionId)
  );
};

// Validation
const currentPageQuestionsAnswered = computed(() => {
  if (isMotivationalPage.value) return true;
  return currentQuestions.value.every(question => question.selected !== null);
});

const allQuestionsAnswered = computed(() => {
  return questions.value.every(question => question.selected !== null);
});

const getCurrentProgress = computed(() => {
  const answeredQuestions = questions.value.filter(q => q.selected !== null).length;
  return Math.round((answeredQuestions / questions.value.length) * 100);
});

// Handle test completion
const handleTestCompletion = () => {
    if (allQuestionsAnswered.value) {
        console.log('Test completed', areaResults.value);
    }
  
    const transformedAreaResults = {
        areas: Object.keys(areaResults.value).map(key => ({
            name: key,
            ...areaResults.value[key]
        }))
    };

    // Store the transformed object in localStorage
    localStorage.setItem('areaResults', JSON.stringify(transformedAreaResults));

    const areaResultsFromStorage = localStorage.getItem('areaResults');
    const sliderDataFromStorage = localStorage.getItem('sliderData');

    // Verificar si hay datos antes de parsear
    if (areaResultsFromStorage) {
        const parsedAreaResults = JSON.parse(areaResultsFromStorage);
        areaResults.value = parsedAreaResults.areas || []; // Acceder a 'areas'
    }

    if (sliderDataFromStorage) {
        const parsedSliderData = JSON.parse(sliderDataFromStorage);
        sliderData.value = parsedSliderData.areas || []; // Acceder a 'areas'
    }

    const results = [];

    areaResults.value.forEach(area => {
        const sliderArea = sliderData.value.find(slider => slider.name === area.name);
        if (sliderArea) {
            // Calcular la puntuación usando la fórmula
            const normalizedInterest = ((area.interested / 5) * 100)  * 0.8;
            const normalizedSlider = ((sliderArea.average) * 100) * 0.2;
            const score = (normalizedInterest + normalizedSlider);
            results.push({
                name: area.name,
                score: score.toFixed(2) 
            });
        }
    });

    const sortedResult = results.sort((a, b) => b.score - a.score)

    localStorage.setItem('results', JSON.stringify(sortedResult));
    navigate('/test-vocacional/result');
};


// Lifecycle
onMounted(() => {
  userData.value = JSON.parse(localStorage.getItem('userData'));
  initializeAreaResults();
  shuffleQuestions();
});
</script>

<template>
  <div class="max-w-screen-lg mx-auto min-h-screen py-10 md:px-5 box-border grid items-center min-w-full md:min-w-[980px]">

    <div class=" flex gap-4 items-center  w-full max-w-screen-xl mx-auto mb-10">
      <div class=" w-full border-2 border-neutral-950 rounded-full h-4 overflow-hidden flex items-center">
        <div
          class="bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500 h-4 rounded-full transition-all  duration-500"
          :style="{ width: `${getCurrentProgress}%` }"
        ></div>
      </div>
      <p class="text-xl font-semibold">{{ getCurrentProgress }}%</p>
       <!-- {{ currentPage }} -->
    </div>

    <!-- Welcome Page -->
    <div v-if="isFirstPage" class=" flex items-center justify-center">
      <div class="">
        <h1 class="text-5xl font-bold from-purple-500 via-pink-600 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent mb-1 pb-2.5">
            Welcome {{ userData.fullname }}
        </h1>
        <h3 class="mt-3 text-lg text-neutral-600">
            Hello! 👋 We are excited to accompany you on this journey of self-discovery.
        </h3>
        <p class="mt-4 text-base text-neutral-600">
            Before we begin, we ask one thing: 
            <span class="bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 bg-[length:100%_2px] bg-no-repeat bg-[bottom] font-bold text-black">
                completely honest and authentic.
            </span> 
            Don't think about what others might expect or what seems "correct." Just think about what you truly feel and want. This is a journey that belongs to you, so there are no right or wrong answers, only your own choices.
        </p>
        <p class="mt-5 text-base text-neutral-600">
            Take the time you need; we want to understand your interests as sincerely and authentically as possible. 💯 Don't worry about anything else; we are here to accompany you every step of this journey!
        </p>
        
      </div>
    </div>

    <!-- Motivational Page -->
    <div v-else-if="isMotivationalPage" class=" flex items-center justify-center">
      <div class="text-center max-w-2xl mx-auto p-8 ">
        <!-- <div class="text-6xl mb-6 animate-bounce">
          {{ motivationalPages[currentPage].image }}
        </div> -->
        <h3 class="text-4xl font-bold from-purple-500 via-pink-600 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent mb-1 pb-2.5">
          {{ motivationalPages[currentPage].title }}
        </h3>
        <p class="text-base text-neutral-600 leading-relaxed">
          {{ motivationalPages[currentPage].message }} 
          <span>{{ motivationalPages[currentPage].image }}</span>
        </p>
        <div class="mt-8">
          <span class="text-sm text-gray-500 italic">
            Current progress: {{ getCurrentProgress }}%
          </span>
        </div>
      </div>
    </div>

    <!-- Questions Form -->
    <div v-else class="space-y-3">
      <div
        v-for="(question, index) in currentQuestions"
        :key="question.id"
        class=" px-5 py-5 rounded-lg "
      >
        <p class="text-base mb-4 text-neutral-600">{{index+1}}.- {{ question.text }}</p>
        <div class="flex space-x-6">
          
            <label class="inline-flex items-center justify-between w-full p-5 border-2 rounded-lg cursor-pointer peer-checked:border-sky-600"
                :class="{
                    'border-green-600 text-green-700 bg-green-100': question.selected === true,
                    ' border-neutral-400  text-neutral-600 bg-transparent hover:text-neutral-800 hover:bg-gray-50 ': question.selected !== true
                }"
            >
                <input type="checkbox" :checked="question.selected === true" @change="handleSelection(question.id, true)" class="hidden peer">
                <div class="block">
                    <div class="w-full text-lg font-semibold">I’m Interested</div>
                    <div class="w-full text-sm">I identify with this option.</div>
                </div>
            </label>

            <label class="inline-flex items-center justify-between w-full p-5 border-2 rounded-lg cursor-pointer peer-checked:border-sky-600"
                :class="{
                    'border-red-800 text-red-800 bg-red-100': question.selected === false,
                    ' border-neutral-400  text-neutral-600 bg-transparent hover:text-neutral-800 hover:bg-gray-50 ': question.selected !== false
                }"
            >                
            <input type="checkbox" :checked="question.selected === false"  @change="handleSelection(question.id, false)" class="hidden peer">
                <div class="block">
                    <div class="w-full text-lg font-semibold">Not Interested</div>
                    <div class="w-full text-sm">I do not identify with this function.</div>
                </div>
            </label>

        </div>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="mt-8 flex justify-between items-center">

      <button 
        v-if="!isFirstPage"
          @click="previousPage"
          class="relative p-[3px] inline-flex items-center justify-center font-bold overflow-hidden group rounded-full">
            <span class="w-full h-full bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500 group-hover:from-rose-400 group-hover:via-fuchsia-500 group-hover:to-indigo-500 absolute"></span>
            <span class="relative px-10 py-3 transition-all ease-out bg-neutral-950 rounded-full group-hover:bg-opacity-0 duration-300 w-full">
                <span class="relative text-white">Previous</span>
            </span>
        </button>
      <div v-else class="w-20"></div>

      <div v-if="!isLastPage">
        <button
          @click="nextPage"
          :disabled="!currentPageQuestionsAnswered"
          :class="{
            'relative p-[3px] inline-flex items-center justify-center font-bold overflow-hidden group rounded-full': true,
            'bg-gray-700 cursor-not-allowed': !currentPageQuestionsAnswered
          }"
        >
          <span
            class="w-full h-full absolute"
            :class="{
              'bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500': currentPageQuestionsAnswered,
              'opacity-50 from-gray-400 via-gray-500 to-gray-700': !currentPageQuestionsAnswered
            }"
          ></span>
          <span
            class="relative px-10 py-3 transition-all ease-out bg-neutral-950 rounded-full group-hover:bg-opacity-0 duration-300 w-full"
            :class="{ 'opacity-50': !currentPageQuestionsAnswered }"
          >
            <span class="relative text-white">Continue</span>
          </span>
        </button>

      </div>
      <div v-else>
        <button
          @click="handleTestCompletion"
          :disabled="!allQuestionsAnswered"
          :class="{
            'relative p-[3px] inline-flex items-center justify-center font-bold overflow-hidden group rounded-full': true,
            'bg-gray-700 cursor-not-allowed': !allQuestionsAnswered
          }"
        >
          <span
            class="w-full h-full absolute"
            :class="{
              'bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500': allQuestionsAnswered,
              'opacity-50 from-gray-400 via-gray-500 to-gray-700': !allQuestionsAnswered
            }"
          ></span>
          <span
            class="relative px-10 py-3 transition-all ease-out bg-neutral-950 rounded-full group-hover:bg-opacity-0 duration-300 w-full"
            :class="{ 'opacity-50': !allQuestionsAnswered }"
          >
            <span class="relative text-white">Finish Test</span>
          </span>
        </button>
      </div>
    </div>

    <!-- Results Summary -->
    <!-- <div class="mt-8 bg-gray-50 p-6 rounded-lg">
      <h3 class="text-2xl font-bold mb-4">Results by Area</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="(results, areaName) in areaResults"
          :key="areaName"
          class="border p-4 rounded-lg"
        >
          <h4 class="font-semibold text-lg">{{ areaName }}</h4>
          <div class="mt-2 space-y-1">
            <p class="text-green-600">Interested: {{ results.interested }}</p>
            <p class="text-red-600">Not Interested: {{ results.notInterested }}</p>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>
