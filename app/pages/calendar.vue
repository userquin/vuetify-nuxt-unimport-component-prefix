<script setup>
const adapter = useVDate()
const colors = ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1']
const titles = ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party']

function onHydrated () {
  console.log('calendar onHydrated')
}
function getEvents ({ start, end }) {
  const evt = []

  const min = start
  const max = end
  const days = (max.getTime() - min.getTime()) / 86400000
  const eventCount = rnd(days, days + 20)

  for (let i = 0; i < eventCount; i++) {
    const allDay = rnd(0, 3) === 0
    const firstTimestamp = rnd(min.getTime(), max.getTime())
    const first = new Date(firstTimestamp - (firstTimestamp % 900000))
    const secondTimestamp = rnd(2, allDay ? 288 : 8) * 900000
    const second = new Date(first.getTime() + secondTimestamp)

    evt.push({
      title: titles[rnd(0, titles.length - 1)],
      start: first,
      end: second,
      color: colors[rnd(0, colors.length - 1)],
      allDay: !allDay,
    })
  }

  return evt
}

const value = useState('calendar:date', () => [new Date()])
const events = useState('calendar:events', () => getEvents({
  start: adapter.startOfDay(adapter.startOfMonth(new Date())),
  end: adapter.endOfDay(adapter.endOfMonth(new Date()))
}))

function rnd (a, b) {
  return Math.floor((b - a + 1) * Math.random()) + a
}

const type = ref('month')
const types =  ref(['month', 'week', 'day'])
const weekday = ref([0, 1, 2, 3, 4, 5, 6])
const weekdays = ref([
  { title: 'Sun - Sat', value: [0, 1, 2, 3, 4, 5, 6] },
  { title: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] },
  { title: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
  { title: 'Mon, Wed, Fri', value: [1, 3, 5] },
])
</script>

<template>
  <div class="calendar-page-container">
    <div>
      <vuetify-sheet
          class="d-flex"
          height="54"
          tile
      >
        <vuetify-select
            v-model="type"
            :items="types"
            class="ma-2"
            density="compact"
            label="View Mode"
            variant="outlined"
            hide-details
        ></vuetify-select>
        <vuetify-select
            v-model="weekday"
            :items="weekdays"
            class="ma-2"
            density="compact"
            label="weekdays"
            variant="outlined"
            hide-details
        ></vuetify-select>
      </vuetify-sheet>
      <vuetify-sheet>
        <vuetify-calendar
            ref="calendar"
            v-model="value"
            :events="events"
            :view-mode="type"
            :weekdays="weekday"
        ></vuetify-calendar>
      </vuetify-sheet>
    </div>

    <vuetify-sheet>
      <lazy-vuetify-calendar
          ref="calendar"
          v-model="value"
          :events="events"
          :view-mode="type"
          :weekdays="weekday"
          hydrate-on-visible
          @hydrated="onHydrated"
      ></lazy-vuetify-calendar>
    </vuetify-sheet>
  </div>
</template>

<style>
.calendar-page-container{
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: 1rem;
}
</style>
