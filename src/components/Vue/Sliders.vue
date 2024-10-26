<script setup>
import { reactive, onMounted, ref } from 'vue';
import { navigate } from 'astro:transitions/client';

// Reactive object to store slider values
const sliderValues = reactive({
    Artistic: 0.5,
    Interpersonal: 0.5,
    Communication: 0.5,
    Managerial: 0.5,
    Mathematics: 0.5,
    Mechanical: 0.5,
    Science: 0.5
});

// Function to calculate averages and store in the desired format
const calculateAverages = () => {
    // Create an array to hold the area data
    const areas = [
        { name: "Arte y Creatividad", average: (sliderValues.Artistic + sliderValues.Communication) / 2 },
        { name: "Ciencias Sociales", average: (sliderValues.Interpersonal + sliderValues.Communication) / 2 },
        { name: "Económica, Administrativa y Financiera", average: sliderValues.Managerial },
        { name: "Ciencia y Tecnología", average: (sliderValues.Mathematics + sliderValues.Mechanical + sliderValues.Science) / 3 },
        { name: "Ciencias Ecológicas, Biológicas y de Salud", average: (sliderValues.Science + sliderValues.Interpersonal) / 2 }
    ];

    return { areas };
};

// Function to handle form submission
const handleContinue = (event) => {
    event.preventDefault(); // Prevent default form submission
    const userData = calculateAverages(); // Calculate averages

    // Log the results to the console
    console.log("Resultados del Test:", userData);

    localStorage.setItem('sliderData', JSON.stringify(userData)); // Store userData in local storage
    navigate('/test-vocacional/questions'); // Navigate to the next page
};
</script>


<template>
    <div class="p-4 ">
        <div class="flex px-4">
            <h1 class="text-4xl font-bold from-purple-500 via-pink-600 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent mb-1">
                Career Aptitude Test 🎓
            </h1>
        </div>
        <p class="text-base px-4">Adjust the Sliders for Career Suggestions</p>

        <form @submit="handleContinue" class="flex flex-col gap-4">
            <div class="flex flex-col">
                <div v-for="(value, key) in sliderValues" :key="key" style="max-width:300px;">
                    <div class="price-range p-4">
                        <span class="text-sm">{{ key }}</span>
                        <input
                            class="w-full accent-indigo-600"
                            type="range"
                            v-model="sliderValues[key]"
                            min="0"
                            max="1"
                            step=".25"
                        />
                        <div class="-mt-2 flex w-full justify-between">
                            <span class="text-sm text-gray-600">None</span>
                            <span class="text-sm text-gray-600">High</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mx-auto w-full max-w-screen-xl flex justify-end">
                <button class="text-red flex break-inside bg-black text-white border-2 border-transparent rounded-3xl px-6 py-3 mb-4 dark:bg-slate-800 dark:text-white hover:before:bg-red border-red-500 relative h-[50px] w-40 overflow-hidden transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-red-500 before:transition-all before:duration-500 hover:text-white hover:shadow-red-500 hover:before:left-0 hover:before:w-full">
                    <span class="relative z-10">Continue</span>
                </button>
            </div>
        </form>
    </div>
</template>
