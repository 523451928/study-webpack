<template>
    <div>
        <fans-list :isFollow="false"></fans-list>
    </div>
</template>

<script>
    /* eslint-disable */
    import fansList from './follow-fans-list.vue'
    export default {
        components: {
            fansList
        }
    }
</script>