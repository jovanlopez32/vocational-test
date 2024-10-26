<script setup>
import { onMounted, ref } from 'vue';
import areasData from '../../assets/data/areasdata.json';
import questionsData from '../../assets/data/questionsdata.json';

const userData = ref('');
onMounted(() => {
    userData.value = JSON.parse(localStorage.getItem('userData'));
});


</script>
<template>

<div class="w-full min-h-screen py-10 px-5">
    <div>
        <h2 class="text-4xl font-bold">Bienvenido {{ userData.fullname }}</h2>
        <p class="mt-3">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maxime quaerat dignissimos ratione illo nemo nihil impedit maiores, fuga consequuntur odit voluptatibus porro rem ut voluptate corrupti sequi hic repellendus? Praesentium?
        </p>
    </div>
    
</div>

    
</template>