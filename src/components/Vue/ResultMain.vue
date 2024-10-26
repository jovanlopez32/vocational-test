<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { Mistral } from "@mistralai/mistralai";
import areasData from '../../assets/data/areasdata.json';
import questionsData from '../../assets/data/questionsdata.json';

const resultPrediction = ref('');
const resultPersonality = ref('');
const resultTest = ref('');
const userData = ref('');
const userMessages = ref([]);
const assistantMessages = ref([]);
const streamText = ref('');
const petition = ref('');
const open = ref(false);

// System content construction
const systemContent = ref('');

// Watchers to store messages in localStorage when they change
watch(userMessages, (newValue) => {
    localStorage.setItem('userMessages', JSON.stringify(newValue));
}, { deep: true });

watch(assistantMessages, (newValue) => {
    localStorage.setItem('assistantMessages', JSON.stringify(newValue));
}, { deep: true });

onMounted(() => {
    resultPrediction.value = localStorage.getItem('results');
    resultPersonality.value = localStorage.getItem('sliderPersonality');
    resultTest.value = localStorage.getItem('areaResults');
    userData.value = localStorage.getItem('userData');

    // Construct the system content using local storage values
    systemContent.value = `Eres Prisma, una IA experta en orientación vocacional capaz de seguir una conversación con el usuario con acceso a estos resultados: RESULTADOS_TEST: ${JSON.stringify(resultTest.value)} RESULTADOS_PERSONALIDAD: ${JSON.stringify(resultPersonality.value)} PREDICCIONES: ${JSON.stringify(resultPrediction.value)} PREGUNTAS_RESPONDIDAS: ${JSON.stringify(questionsData)} MÉTODO DE ANÁLISIS: 1. Analiza la pregunta del usuario 2. Revisa los datos relevantes en los resultados 3. Compara patrones entre áreas y personalidad 4. Formula una respuesta estructurada 5. Añade un toque empático y emoji relevante REGLAS: - Piensa paso a paso antes de responder - Usa siempre datos concretos de los resultados - Incluye al menos un emoji por respuesta - Mantén un tono profesional pero cercano - Solo habla sobre orientación vocacional - Si no tienes suficiente información, comunícalo - No inventes datos o estadísticas FORMATO DE RESPUESTA: 1. Saludo empático 2. Análisis basado en datos 3. Recomendación específica 4. Conclusión motivacional. Dame respuestas cortas`;

    // Open the modal and set it to close after 5 seconds
    run()
    open.value = true;
    setTimeout(() => {
        open.value = false;
    }, 0); // Close modal after 5000 milliseconds (5 seconds)
});

const mistral = new Mistral({
  apiKey: "tLStop8yeeMECtb0G4Y8tfXXRCjPLvRp",
});

async function run() {
    streamText.value = '';

    // Save the user's petition (message)
    userMessages.value.push(petition.value); // Store user message

    // Construct the message JSON array
    const messages = [
        { role: 'system', content: systemContent.value },
    ];

    // Append previous user and assistant messages alternately
    userMessages.value.forEach((msg, index) => {
        messages.push({ role: 'user', content: msg });
        if (assistantMessages.value[index]) {
            messages.push({ role: 'assistant', content: assistantMessages.value[index] });
        }
    });

    // Debugging: Log constructed messages
    console.log("Constructed Messages:", JSON.stringify(messages, null, 2));

    try {
        const result = await mistral.chat.stream({
            model: "open-mixtral-8x7b",
            messages: messages
        });

        let currentResponse = '';
        for await (const chunk of result) {
            const content = chunk.data.choices[0].delta.content;
            currentResponse += content;
            streamText.value += content;
        }

        // Save the assistant's response
        assistantMessages.value.push(currentResponse); // Store assistant response
    } catch (error) {
        console.error('Error fetching response:', error);
        assistantMessages.value.push('Sorry, something went wrong. Please try again later. 😔');
    }

    // Clear the petition input
    petition.value = '';
}

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
                <!-- <tbody>
                    <tr v-for="(result, index) in resultPrediction" :key="index">
                        <td scope="row" class="px-6 py-4">{{ index + 1 }}</td>
                        <td>{{ result.name }}</td>
                        <td>{{ result.score }}%</td>
                    </tr>
                </tbody> -->
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
            <!-- Chat box -->
            <div class="w-full min-h-[500px] h-full max-h-[80%] rounded-2xl border border-solid border-black p-5 bg-neutral-50/80 saturate-100 backdrop-filter backdrop-contrast-100 backdrop-blur-[8px] bg-clip-padding mb-5 overflow-y-auto">
                <div v-for="(message, index) in assistantMessages" :key="index" class="mb-4">
                    <!-- Skip system message (index 0) -->
                    <diV :class="['p-3 rounded-lg', 
                        message.role === 'user' 
                            ? 'bg-blue-100 ml-auto max-w-[80%]' 
                            : 'bg-gray-100 mr-auto max-w-[80%]']">
                        {{ message.content }}
                    </div>
                </div>
                <!-- Show streaming response if any -->
                <div v-if="streamText" class="bg-gray-100 p-3 rounded-lg mr-auto max-w-[80%]">
                    {{ streamText }}
                </div>
            </div>
            <div class="flex gap-4">
                <input placeholder="Your petition" v-model="petition" type="text" class="px-4 py-3 w-full rounded-2xl border border-solid border-black p-5 bg-neutral-50/80 saturate-100 backdrop-filter backdrop-contrast-100 backdrop-blur-[8px] bg-clip-padding ">
                <button @click="run()" class="relative p-[3px] inline-flex items-center justify-center font-bold overflow-hidden group rounded-full">
                    <span class="w-full h-full bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500 group-hover:from-rose-400 group-hover:via-fuchsia-500 group-hover:to-indigo-500 absolute"></span>
                    <span class="relative px-10 py-3 transition-all ease-out bg-neutral-950 rounded-full group-hover:bg-opacity-0 duration-300 w-full flex justify-center">
                        <span class="relative text-white">Send</span>
                    </span>
                </button>
            </div>
        </div>
    </div>

    <div class="absolute -top-20 left-0 translate-x-1/4 w-96 h-80 bg-rose-400/40 rounded-full blur-3xl rotate-9 mix-blend-multiply -z-10"></div>
    <div class="absolute -top-20 left-0 translate-x-2/4 w-1/3 h-80 bg-indigo-500/40 rounded-full blur-3xl rotate-12 mix-blend-multiply -z-10"></div>

    <!-- Modal Overlay -->
    <div v-if="open" class="fixed inset-0 px-2 z-10 overflow-hidden flex items-center justify-center">
        <div x-show="open" x-transition:enter="transition-opacity ease-out duration-300" x-transition:enter-start="opacity-0" x-transition:enter-end="opacity-100" x-transition:leave="transition-opacity ease-in duration-300" x-transition:leave-start="opacity-100" x-transition:leave-end="opacity-0" class="absolute inset-0 bg-white bg-opacity-100 transition-opacity"></div>
            <!-- Modal Content -->
            <div x-show="open" 
            x-transition:enter="transition-transform ease-out duration-300" 
            x-transition:enter-start="transform scale-75" 
            x-transition:enter-end="transform scale-100" 
            x-transition:leave="transition-transform ease-in duration-300" 
            x-transition:leave-start="transform scale-100" 
            x-transition:leave-end="transform scale-75" 
            class=" rounded-md overflow-hidden max-w-md w-full sm:w-96 md:w-1/2 lg:w-2/3 xl:w-1/3 z-50">
            <!-- Modal Header -->
            <div class="flex-col gap-4 w-full h-full flex items-center justify-center">
                <div class="w-28 h-28 border-8 text-blue-400 text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-blue-400 rounded-full">
                    <svg viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em" class="animate-ping">
                    <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"></path>
                    </svg>
                </div>
                <h3 class="text-black animate-pulse">Loading...</h3>
            </div>
        </div>
    </div>

</template>
