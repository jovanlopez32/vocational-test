<script setup >
import { reactive, ref } from 'vue';
import { navigate } from 'astro:transitions/client';
/* https://github.com/withastro/roadmap/discussions/653 */

/* import { Mistral } from "@mistralai/mistralai";

const mistral = new Mistral({
  apiKey: "tLStop8yeeMECtb0G4Y8tfXXRCjPLvRp",
});

const streamText = ref('');
async function run() {
  const result = await mistral.chat.stream({
    model: "open-mistral-7b",
    messages: [{role: 'user', content: 'What is the best French cheese?'}],
  });


  for await (const chunk of result) {
      streamText.value += chunk.data.choices[0].delta.content;
  }
} */


const formatData = reactive({ fullname: '', city: '', email: '' });

const handleSubmit = (event) => {
  event.preventDefault(); // Evita el comportamiento por defecto del formulario.
  localStorage.setItem('userData', JSON.stringify(formatData));
  
  navigate('/test-vocacional/questions');
};


</script>

<template>
  <!-- <button @click="run()" class="bg-neutral-800/90 py-2 px-4 rounded-lg text-white hover:bg-neutral-900 transition-all duration-500">mistral</button>
  {{ streamText }} -->
  <div class="max-w-screen-lg">
    <a href="/" class="flex items-center gap-1 mb-8 ">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-6 fill-neutral-950">
        <path d="M12.707 17.293 8.414 13H18v-2H8.414l4.293-4.293-1.414-1.414L4.586 12l6.707 6.707z"></path>
      </svg>
      <span>Volver</span>
    </a>
    
    <div>
      <h1 class="text-5xl font-bold from-purple-500 via-pink-600 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent mb-1">
        Es tu momento de <span>brillar!</span>
      </h1>
      <h2 class="text-lg mb-5">
        <span class="bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 bg-[length:100%_2px] bg-no-repeat bg-[bottom]">Cada persona</span>,
        como un prisma, <span class="bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 bg-[length:100%_2px] bg-no-repeat bg-[bottom]">tiene múltiples facetas y colores por descubrir.</span>
      </h2>
      <p>Para que puedas explorar el camino que mejor refleja tu esencia, necesitamos algunos detalles básicos sobre ti.</p>
    </div>
    
    <div class="mt-5 mb-10">
      <form @submit="handleSubmit" class="w-full max-w-screen-md grid gap-4" data-astro-reload>
        <div class="grid gap-2">
          <label class="font-semibold text-lg" for="fullname">Nombre Completo</label>
          <input v-model="formatData.fullname" type="text" placeholder="John Bradley" required class="px-4 py-1 border-2 border-neutral-700 rounded-lg bg-transparent">
        </div>
        <div class="grid gap-2">
          <label class="font-semibold text-lg" for="city">Estado de la Republica</label>
          <input v-model="formatData.city" type="text" placeholder="San Luis Potosi" required class="px-4 py-1 border-2 border-neutral-700 rounded-lg bg-transparent">
        </div>
        <div class="grid gap-2">
          <label class="font-semibold text-lg" for="email">Correo Electronico</label>
          <input v-model="formatData.email" type="text" placeholder="john.bradley@prisma.com" required class="px-4 py-1 border-2 border-neutral-700 rounded-lg bg-transparent">
        </div>
        <button class="bg-neutral-800/90 py-2 px-4 rounded-lg text-white hover:bg-neutral-900 transition-all duration-500">
          Continuar
        </button>
      </form>
    </div>

    {{ formatData }}

    <div>
      <h3 class="mb-3 text-xl font-semibold">¿Por qué te lo pedimos?</h3>
      <p>Queremos entender mejor qué carreras y talentos se buscan en cada rincón del país, y así ayudar a otros como tú a encontrar su vocación. ¡Tu información es parte de algo más grande!</p>
      <p class="text-xs mt-4">Tu privacidad es importante para nosotros.</p>
      <p class="text-xs mt-1">
        Tus datos estarán protegidos y jamás compartidos con terceros. Si quieres conocer más sobre cómo los cuidamos, puedes leer nuestro
        <a class="underline text-rose-600" href="/test-vocacional/aviso-de-privacidad">aviso de privacidad</a>.
      </p>
    </div>
  </div>
</template>
