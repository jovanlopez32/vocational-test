<script setup>
import { onMounted, ref, computed } from 'vue';
import areasData from '../../assets/data/areasdata.json';
import questionsData from '../../assets/data/questionsdata.json';

// Constants
const QUESTIONS_PER_PAGE = 5;

// State management
const userData = ref('');
const questions = ref([]);
const currentPage = ref(1);
const areaResults = ref({});

// Motivational pages configuration
const motivationalPages = {
  3: {
    title: "¡Vas por buen camino!",
    message: "Has completado un tercio del test y lo estás haciendo genial. Tómate un respiro, reflexiona sobre tus respuestas anteriores. Cada elección que haces nos ayuda a conocerte mejor. ¡Sigamos adelante juntos!",
    image: "🌟"
  },
  6: {
    title: "¡La meta está cada vez más cerca!",
    message: "¡Wow! Ya has completado más de la mitad del test. Tu dedicación y sinceridad en cada respuesta están construyendo un perfil único, tan único como tú. Respira profundo, que vamos por la última etapa. ¡Tú puedes!",
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
const calculatedTotalPages = computed(() => Math.ceil(questions.value.length / QUESTIONS_PER_PAGE) + 2); // +2 for motivational pages

const isMotivationalPage = computed(() => {
  return Object.keys(motivationalPages).includes(currentPage.value.toString());
});

const currentQuestions = computed(() => {
  if (isMotivationalPage.value) return [];
  
  let adjustedPage = currentPage.value;
  // Adjust page number to account for motivational pages
  if (currentPage.value > 3) adjustedPage--;
  if (currentPage.value > 6) adjustedPage--;
  
  const start = (adjustedPage - 1) * QUESTIONS_PER_PAGE;
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
  <div class="w-full min-h-screen py-10 px-5">
    <!-- Header -->
    <div class="mb-8">
      <h2 class="text-4xl font-bold">Bienvenido {{ userData.fullname }}</h2>
      <p class="mt-3">
        Por favor, responde a todas las preguntas seleccionando si te interesa o no te interesa cada actividad.
      </p>
      <div class="mt-4 w-full bg-gray-200 rounded-full h-2.5">
        <div
          class="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
          :style="{ width: `${getCurrentProgress}%` }"
        ></div>
      </div>
    </div>

    <!-- Motivational Page -->
    <div v-if="isMotivationalPage" class="min-h-[400px] flex items-center justify-center">
      <div class="text-center max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg transform transition-all duration-500 hover:scale-105">
        <div class="text-6xl mb-6 animate-bounce">
          {{ motivationalPages[currentPage].image }}
        </div>
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
    <div v-else class="space-y-6">
      <div
        v-for="question in currentQuestions"
        :key="question.id"
        class="bg-white p-6 rounded-lg shadow transition-all duration-300"
      >
        <p class="text-lg mb-4">{{ question.text }}</p>
        <div class="flex space-x-6">
          <label class="flex items-center space-x-2 cursor-pointer group">
            <input
              type="checkbox"
              :checked="question.selected === true"
              @change="handleSelection(question.id, true)"
              class="form-checkbox h-5 w-5 text-blue-600 transition-colors duration-200"
            >
            <span class="group-hover:text-blue-600 transition-colors duration-200">
              Me interesa
            </span>
          </label>
          
          <label class="flex items-center space-x-2 cursor-pointer group">
            <input
              type="checkbox"
              :checked="question.selected === false"
              @change="handleSelection(question.id, false)"
              class="form-checkbox h-5 w-5 text-red-600 transition-colors duration-200"
            >
            <span class="group-hover:text-red-600 transition-colors duration-200">
              No me interesa
            </span>
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
    <div class="mt-8 bg-gray-50 p-6 rounded-lg">
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
    </div>
  </div>
</template>