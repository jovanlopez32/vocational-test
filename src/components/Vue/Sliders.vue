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
        { name: "Arte y Creatividad", average: (parseInt(sliderValues.Artistic) + parseInt(sliderValues.Communication)) / 2 },
        { name: "Ciencias Sociales", average: (parseInt(sliderValues.Interpersonal) + parseInt(sliderValues.Communication)) / 2 },
        { name: "Económica, Administrativa y Financiera", average: parseInt(sliderValues.Managerial) },
        { name: "Ciencia y Tecnología", average: (parseInt(sliderValues.Mathematics) + parseInt(sliderValues.Mechanical) + parseInt(sliderValues.Science)) / 3 },
        { name: "Ciencias Ecológicas, Biológicas y de Salud", average: (parseInt(sliderValues.Science) + parseInt(sliderValues.Interpersonal)) / 2 }
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
    <div class="max-w-screen-lg mx-auto p-5">
        <a href="/test-vocacional/registro" class="flex items-center gap-1 mb-8 px-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-6 fill-neutral-950">
                <path d="M12.707 17.293 8.414 13H18v-2H8.414l4.293-4.293-1.414-1.414L4.586 12l6.707 6.707z"></path>
            </svg>
            <span>Back</span>
        </a>

        <div class="flex px-4 gap-2">
            <h1 class="text-5xl font-bold from-purple-500 via-pink-600 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent mb-1 pb-2.5">
                Career Aptitude Test
            </h1>
            <span class="mb-8 text-5xl font-bold">🎓</span>
        </div>
        <p class="text-base px-4 text-neutral-600">
            Feel free to adjust the sliders to help us give you the best career suggestions! 
            Take your time and choose what you enjoy the most. 
            Remember, this is all about you and your passions!
        </p>

        <form @submit="handleContinue" class="flex flex-col gap-4">
            <div class="flex flex-col">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div v-for="(value, key) in sliderValues" :key="key" style="max-width:300px;">
                        <div class="price-range p-4">
                            <span class="font-semibold text-sm"> {{ key }} </span>
                            <input
                                class="w-full accent-indigo-500"
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
            </div>

            <div class="mx-auto w-full max-w-screen-xl flex justify-end">
                <button class="relative p-[3px] inline-flex items-center justify-center font-bold overflow-hidden group rounded-full">
                    <span class="w-full h-full bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500 group-hover:from-rose-400 group-hover:via-fuchsia-500 group-hover:to-indigo-500 absolute"></span>
                    <span class="relative px-10 py-3 transition-all ease-out bg-neutral-950 rounded-full group-hover:bg-opacity-0 duration-300 w-full">
                        <span class="relative text-white">Continue</span>
                    </span>
                </button>
            </div>
        </form>
    </div>
</template>
