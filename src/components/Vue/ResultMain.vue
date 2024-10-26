<script setup>
import { ref, onMounted, computed } from 'vue';
import { Mistral } from "@mistralai/mistralai";


const mistral = new Mistral({
  apiKey: "tLStop8yeeMECtb0G4Y8tfXXRCjPLvRp",
});

const streamText = ref('');

async function run() {
  const result = await mistral.chat.stream({
    model: "open-mistral-7b",
    messages: [
        {role: 'system', content: 'You are a helpful assistant that specializes in French cuisine.'},
        {role: 'user', content: 'What is the best French cheese?'}

    ],
  });

  for await (const chunk of result) {
      streamText.value += chunk.data.choices[0].delta.content;
  }
} 


// Crear referencias para almacenar los datos
const areaResults = ref([]);
const sliderData = ref([]);

onMounted(() => {
    // Obtener los datos de localStorage
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
});

// Computed para calcular las puntuaciones
const calculationResults = computed(() => {
    const results = [];

    console.log("resultado:", areaResults.value, "slider:", sliderData.value);

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
    console.log("results:", results);

    return results.sort((a, b) => b.score - a.score);
});

// Mostrar los resultados en consola
console.log(calculationResults.value);
</script>
<template>
    <div class="grid grid-cols-7 grid-rows-7 gap-5 w-full min-h-screen absolute left-0 top-0 p-5 box-border">
        <div class="col-span-2 row-span-7 rounded-2xl border border-solid border-black p-5 bg-neutral-50/80 saturate-100 backdrop-filter backdrop-contrast-100 backdrop-blur-[8px] bg-clip-padding">
            <!-- Title -->
            <div class="flex items-center justify-start gap-2 mb-4">
                <h1 class="text-2xl font-bold">🏆 Race Leaderboard</h1>
            </div>
            <table class="w-full text-sm text-left rtl:text-right text-neutral-800">
                <thead class="text-neutral-900 uppercase">
                    <tr>
                        <th scope="col" class="py-3">Position</th>
                        <th scope="col" class="py-3">Area</th>
                        <th scope="col" class="py-3">Score</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(result, index) in calculationResults" :key="index">
                        <td scope="row" class="px-6 py-4">{{ index + 1 }}</td>
                        <td>{{ result.name }}</td>
                        <td>{{ result.score }}%</td>
                    </tr>
                </tbody>
            </table>

            <div class="mt-5">
                <h2 class="text-xl font-bold">Key Skills</h2>
                <h3 class="text-base font-bold mt-3">Computing</h3>
                <ul class="list-disc ml-4 text-sm columns-2 gap-10 mt-2">
                    <li>Logical Thinking</li>
                    <li>Problem Solving</li>
                    <li>Teamwork</li>
                    <li>Leadership</li>
                </ul>
                <!-- Repeat as necessary -->
            </div>

            <div class="mt-5 text-sm">
                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolores necessitatibus error, doloremque nulla minus incidunt explicabo rem a id eaque.</p>
            </div>
        </div>
        <!-- Chat -->
        <div class="col-span-5 row-span-6 rounded-2xl border border-solid border-black p-5 bg-neutral-50/80 saturate-100 backdrop-filter backdrop-contrast-100 backdrop-blur-[8px] bg-clip-padding">
            <div class="mb-5">
                <h2 class="text-3xl font-bold">Ask the AI about 
                    <span class="bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 bg-[length:100%_2px] bg-no-repeat bg-[bottom]">your career</span>
                    ! 🤖 
                </h2>
            </div>
            <div class="w-full min-h-[500px] h-full max-h-[80%] rounded-2xl border border-solid border-black p-5 bg-neutral-50/80 saturate-100 backdrop-filter backdrop-contrast-100 backdrop-blur-[8px] bg-clip-padding mb-5"></div>
            <div class="flex gap-4">
                <input type="text" class="px-4 py-3 w-full rounded-2xl border border-solid border-black p-5 bg-neutral-50/80 saturate-100 backdrop-filter backdrop-contrast-100 backdrop-blur-[8px] bg-clip-padding ">
                <button class="relative p-[3px] inline-flex items-center justify-center font-bold overflow-hidden group rounded-full">
                    <span class="w-full h-full bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500 group-hover:from-rose-400 group-hover:via-fuchsia-500 group-hover:to-indigo-500 absolute"></span>
                    <span class="relative px-10 py-3 transition-all ease-out bg-neutral-950 rounded-full group-hover:bg-opacity-0 duration-300 w-full flex justify-center">
                        <span class="relative text-white">Send</span>
                    </span>
                </button>
            </div>
        </div>

        <div class="col-span-2 col-start-4 row-start-7">4</div>
        <div class="col-span-2 col-start-6 row-start-7">5</div>
    </div>

    <div class="absolute -top-20 left-0 translate-x-1/4 w-96 h-80 bg-rose-400/40 rounded-full blur-3xl rotate-9 mix-blend-multiply -z-10"></div>
    <div class="absolute -top-20 left-0 translate-x-2/4 w-1/3 h-80 bg-indigo-500/40 rounded-full blur-3xl rotate-12 mix-blend-multiply -z-10"></div>
</template>
