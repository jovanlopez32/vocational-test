<script setup>
import { onMounted, ref, computed } from 'vue';
import areasData from '../../assets/data/areasdata.json';
import questionsData from '../../assets/data/questionsdata.json';

// Constants
const QUESTIONS_PER_PAGE = 3;
const TOTAL_QUESTIONS = questionsData.preguntas.length;
const TOTAL_PAGES = Math.ceil(TOTAL_QUESTIONS / QUESTIONS_PER_PAGE)+4;
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

// Motivational pages configuration
const motivationalPages = {
  [QUARTER_PAGE]: {
    title: "¡Excelente progreso!",
    message: "Has completado un cuarto del test. Tu honestidad en cada respuesta nos ayuda a conocerte mejor. ¡Continúa así!",
    image: "🌱"
  },
  [HALF_PAGE]: {
    title: "¡Vas por la mitad!",
    message: "¡Fantástico! Has llegado a la mitad del test. Cada respuesta nos ayuda a construir un perfil único, tan único como tú. ¡Sigamos adelante!",
    image: "🌟"
  },
  [THREE_QUARTERS_PAGE]: {
    title: "¡La meta está cada vez más cerca!",
    message: "¡Increíble! Has completado tres cuartos del test. Tu dedicación en cada respuesta está dando sus frutos. ¡Ya casi llegamos!",
    image: "✨"
  }
};

// Initialize area results
const initializeAreaResults = () => {
  areasData.areas.forEach(area => {
    areaResults.value[area.name] = {
      meInteresa: 0,
      noMeInteresa: 0
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
const calculatedTotalPages = computed(() => Math.ceil(questions.value.length / QUESTIONS_PER_PAGE) + 3);  // +1 for the welcome page

const isMotivationalPage = computed(() => {
  return Object.keys(motivationalPages).includes(currentPage.value.toString());
});

const currentQuestions = computed(() => {
  if (isMotivationalPage.value) return [];

  let adjustedPage = currentPage.value;
  // Adjust page number to account for motivational pages
  if (currentPage.value > 3) adjustedPage--;
  if (currentPage.value > 6) adjustedPage--;

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
        const counter = question.selected ? 'meInteresa' : 'noMeInteresa';
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
    console.log('Test completado', areaResults.value);
  }
};

// Lifecycle
onMounted(() => {
  userData.value = JSON.parse(localStorage.getItem('userData'));
  initializeAreaResults();
  shuffleQuestions();
});
</script>

<template>
  <div class="w-full min-h-screen py-10 px-5 box-border grid items-center">

    <div class=" flex gap-4 items-center  w-full max-w-screen-xl mx-auto mb-10">
      <div class=" w-full border-2 border-neutral-950 rounded-full h-4 overflow-hidden flex items-center">
        <div
          class="bg-blue-600 h-4 rounded-full transition-all  duration-500"
          :style="{ width: `${getCurrentProgress}%` }"
        ></div>
      </div>
      <p class="text-xl font-semibold">{{ getCurrentProgress }}%</p>
    </div>

    <!-- Welcome Page -->
    <div v-if="isFirstPage" class=" flex items-center justify-center">
      <div class="">
        <h2 class="text-5xl font-bold">Bienvenido {{ userData.fullname }}</h2>
        <h3 class="mt-3 text-lg">
            ¡Hola! Estamos emocionados de acompañarte en este viaje de autodescubrimiento.
        </h3>
        <p class="mt-4 text-base">
            Antes de comenzar, te pedimos una cosa: <strong>sé completamente honesto y auténtico.</strong> No pienses en lo que los demás esperarían o en lo que parecería "correcto". Piensa solo en lo que realmente sientes y deseas. Este es un viaje que te pertenece, así que no hay respuestas buenas o malas, solo tus propias elecciones.
        </p>
        <p class="mt-5 text-base">
            Tómate el tiempo que necesites, queremos entender tus intereses de la forma más sincera y auténtica posible. ¡No te preocupes por nada más, estamos aquí para acompañarte en cada paso de este viaje!
        </p>
        
      </div>
    </div>

    <!-- Motivational Page -->
    <div v-else-if="isMotivationalPage" class=" flex items-center justify-center">
      <div class="text-center max-w-2xl mx-auto p-8 ">
        <!-- <div class="text-6xl mb-6 animate-bounce">
          {{ motivationalPages[currentPage].image }}
        </div> -->
        <h3 class="text-3xl font-bold mb-6 text-blue-600">
          {{ motivationalPages[currentPage].title }}
        </h3>
        <p class="text-lg text-gray-700 leading-relaxed">
          {{ motivationalPages[currentPage].message }}
        </p>
        <div class="mt-8">
          <span class="text-sm text-gray-500">
            Progreso actual: {{ getCurrentProgress }}%
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
        <p class="text-lg mb-4">{{index+1}}.- {{ question.text }}</p>
        <div class="flex space-x-6">
          
            
            <label class="inline-flex items-center justify-between w-full p-5 text-neutral-600 bg-transparent border-2 border-neutral-400 rounded-lg cursor-pointer  peer-checked:border-blue-600 hover:text-neutral-800  peer-checked:text-gray-600 hover:bg-gray-50" :class="question.selected === true ? '!border-sky-600 text-neutral-800  !bg-gray-50' : 'bg-transparent'" >
                <input type="checkbox" :checked="question.selected === true" @change="handleSelection(question.id, true)" class="hidden peer">
                <div class="block">
                    <!-- <svg class="mb-2 text-green-400 w-7 h-7" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M356.9 64.3H280l-56 88.6-48-88.6H0L224 448 448 64.3h-91.1zm-301.2 32h53.8L224 294.5 338.4 96.3h53.8L224 384.5 55.7 96.3z"/></svg> -->
                    <div class="w-full text-lg font-semibold">Me interesa</div>
                    <div class="w-full text-sm">Me siento identificado con esta opción.</div>
                </div>
            </label>

            <label class="inline-flex items-center justify-between w-full p-5 text-neutral-600 bg-transparent border-2 border-neutral-400 rounded-lg cursor-pointer  peer-checked:border-blue-600 hover:text-neutral-800  peer-checked:text-gray-600 hover:bg-gray-50" :class="question.selected === false ? '!border-red-600 text-neutral-800 !bg-gray-50' : 'bg-transparent'" >
                <input type="checkbox" :checked="question.selected === false"  @change="handleSelection(question.id, false)" class="hidden peer">
                <div class="block">
                    <!-- <svg class="mb-2 text-green-400 w-7 h-7" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M356.9 64.3H280l-56 88.6-48-88.6H0L224 448 448 64.3h-91.1zm-301.2 32h53.8L224 294.5 338.4 96.3h53.8L224 384.5 55.7 96.3z"/></svg> -->
                    <div class="w-full text-lg font-semibold">No me interesa</div>
                    <div class="w-full text-sm">No me siento identificado con esta función.</div>
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
        class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
      >
        Anterior
      </button>
      <div v-else class="w-20"></div>

      <div v-if="!isLastPage">
        <button
          @click="nextPage"
          :disabled="!currentPageQuestionsAnswered"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>
      <div v-else>
        <button
          @click="handleTestCompletion"
          :disabled="!allQuestionsAnswered"
          class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Finalizar Test
        </button>
      </div>
    </div>

    <!-- Results Summary -->
    <!-- <div class="mt-8 bg-gray-50 p-6 rounded-lg">
      <h3 class="text-2xl font-bold mb-4">Resultados por área</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="(results, areaName) in areaResults"
          :key="areaName"
          class="border p-4 rounded-lg"
        >
          <h4 class="font-semibold text-lg">{{ areaName }}</h4>
          <div class="mt-2 space-y-1">
            <p class="text-green-600">Me interesa: {{ results.meInteresa }}</p>
            <p class="text-red-600">No me interesa: {{ results.noMeInteresa }}</p>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>
