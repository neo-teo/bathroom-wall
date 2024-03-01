<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Calendar, type Month } from 'bits-ui';
	import moment from 'moment';
	import { createEventDispatcher } from 'svelte';
	import { CalendarDate, type DateValue } from '@internationalized/date';

	export let initialValue: string; // initial value
	export let timeGroupToCount: Map<string, number>;

	let value: CalendarDate = new CalendarDate(
		+initialValue.split('-')[2],
		+initialValue.split('-')[0],
		+initialValue.split('-')[1]
	);

	const dispatch = createEventDispatcher();

	function getTodaysDate() {
		const date = new Date();
		return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
	}

	const maxCount = Math.max(...Array.from(timeGroupToCount.values()));

	function getColorIntensity(count: number) {
		const white = { r: 255, g: 255, b: 255 };
		const blue = { r: 59, g: 130, b: 246 };

		// interpolate between white and blue based on the ratio
		const ratio = count / maxCount;
		const r = Math.round(white.r + (blue.r - white.r) * ratio);
		const g = Math.round(white.g + (blue.g - white.g) * ratio);
		const b = Math.round(white.b + (blue.b - white.b) * ratio);

		return `rgb(${r}, ${g}, ${b})`;
	}

	function countForDate(date: DateValue) {
		const timeGroup = moment(date, 'YYYY-MM-DD').format('MM-DD-YYYY');
		return timeGroupToCount.get(timeGroup) ?? 0;
	}

	function dateSelected(newValue: DateValue | DateValue[] | undefined) {
		// if newValue is undefined it means we selected the value that was already selected
		dispatch('dateSelected', {
			date: newValue ? (newValue as DateValue).toString() : value.toString()
		});
	}

	let minValue = new CalendarDate(2024, 1, 1);
	let maxValue = getTodaysDate();
</script>

<Calendar.Root
	class="rounded-sm border border-gray-300 bg-white p-2 text-sm"
	let:months
	let:weekdays
	{minValue}
	{maxValue}
	weekdayFormat="short"
	{value}
	onValueChange={dateSelected}
	isDateDisabled={(date) =>
		// NOTE: commented out line below aims to disable dates that have a count of 0
		// (date.compare(getTodaysDate()) !== 0 && countForDate(date) === 0) ||
		date.compare(minValue) < 0 || date.compare(maxValue) > 0}
	initialFocus
>
	<Calendar.Header class="mb-4 flex items-center justify-center gap-5 p-2">
		<Calendar.PrevButton>
			<Icon icon="radix-icons:caret-left" width="24" />
		</Calendar.PrevButton>
		<Calendar.Heading let:headingValue class="w-[150px] text-center text-lg font-medium"
		></Calendar.Heading>
		<Calendar.NextButton>
			<Icon icon="radix-icons:caret-right" width="24" />
		</Calendar.NextButton>
	</Calendar.Header>

	{#each months as month}
		<Calendar.Grid class="flex flex-col">
			<Calendar.GridHead>
				<Calendar.GridRow class="grid grid-cols-7">
					{#each weekdays as day}
						<Calendar.HeadCell class="text-center text-xs font-normal">
							<div>{day.slice(0, 3)}</div>
						</Calendar.HeadCell>
					{/each}
				</Calendar.GridRow>
			</Calendar.GridHead>
			<Calendar.GridBody>
				{#each month.weeks as weekDates}
					<Calendar.GridRow class="grid grid-cols-7">
						{#each weekDates as date}
							<Calendar.Cell {date} class="py-2 text-center">
								<Calendar.Day
									{date}
									month={month.value}
									class={`flex flex-col items-center py-2 data-[outside-month]:pointer-events-none data-[today]:font-bold data-[outside-month]:text-gray-300 ${date.compare(maxValue) > 0 ? 'pointer-events-none text-gray-300' : ''}`}
								>
									{date.day}
									<div
										class="h-4 w-4 rounded-xl border"
										style="background-color: {getColorIntensity(countForDate(date))}"
									></div>
								</Calendar.Day>
							</Calendar.Cell>
						{/each}
					</Calendar.GridRow>
				{/each}
			</Calendar.GridBody>
		</Calendar.Grid>
	{/each}
</Calendar.Root>

<div class="flex items-center justify-center gap-2 text-sm">
	<div>less</div>
	<div class="h-2 w-[120px] rounded border bg-gradient-to-r from-white via-blue-100 to-blue-500" />
	<div>more</div>
</div>
