<!-- One shared grid so every BarRow lines up like a table column.
     Columns: name, street, city (sm+), zip (lg+), country (md+), distance, activity.
     The distance column takes the leftover space so the address fields stay together. -->
<div
	class="grid grid-cols-[fit-content(45%)_fit-content(45%)_1fr_auto] gap-x-4 text-base sm:grid-cols-[fit-content(35%)_fit-content(35%)_fit-content(10rem)_1fr_auto] md:grid-cols-[fit-content(30%)_fit-content(30%)_fit-content(10rem)_auto_1fr_auto] lg:grid-cols-[fit-content(30%)_fit-content(30%)_fit-content(10rem)_auto_auto_1fr_auto]"
>
	<slot />
</div>
