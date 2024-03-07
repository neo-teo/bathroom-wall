<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Calendar, type Month } from 'bits-ui';
	import moment from 'moment';
	import { createEventDispatcher } from 'svelte';
	import { CalendarDate, type DateValue } from '@internationalized/date';
	import ActivityIndicatorLegend from './ActivityIndicatorLegend.svelte';
	import ActivityIndicator from './ActivityIndicator.svelte';
	import { dateToTimeGroup } from '$lib/utils/timeUtils';
	import WallContainer from './WallContainer.svelte';

	export let initialValue: string; // initial value
	export let timeGroupToCount: Map<string, number>;

	let value: CalendarDate = new CalendarDate(
		+initialValue.split('-')[2],
		+initialValue.split('-')[0],
		+initialValue.split('-')[1]
	);

	const dispatch = createEventDispatcher();

	function getTodaysDate() {
		const todaysTimeGroup = dateToTimeGroup(new Date());
		return new CalendarDate(
			+todaysTimeGroup.split('-')[2],
			+todaysTimeGroup.split('-')[0],
			+todaysTimeGroup.split('-')[1]
		);
	}

	const maxCount = Math.max(...Array.from(timeGroupToCount.values()));

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

<WallContainer>
	<Calendar.Root
		class="px-2 text-sm"
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
										class={`flex flex-col items-center py-2 data-[outside-month]:hidden ${date.compare(maxValue) === 0 ? 'font-bold' : ''} ${date.compare(maxValue) > 0 ? 'pointer-events-none text-gray-300' : ''}`}
									>
										{date.day}
										<ActivityIndicator value={countForDate(date)} maxValue={maxCount} />
									</Calendar.Day>
								</Calendar.Cell>
							{/each}
						</Calendar.GridRow>
					{/each}
				</Calendar.GridBody>
			</Calendar.Grid>
		{/each}
	</Calendar.Root>
</WallContainer>

<div class="px-5">
	<ActivityIndicatorLegend />
</div>
