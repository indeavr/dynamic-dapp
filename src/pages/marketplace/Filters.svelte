<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    let sortingConfig = [
    ];
    const filterConfig = [
        {
            text: "All",
            index: 0,
            value: null,
            onClick: () => onFiltersChanged(0),
        },
        {
            text: "Hot",
            index: 1,
            value: null,
            onClick: () => onFiltersChanged(1),
        },
        {
            text: "New",
            index: 2,
            value: null,
            onClick: () => onFiltersChanged(2),
        },
    ]

    const params = new URLSearchParams(window.location.search)
    let query = {};
    for (const param of params) {
        query[param[0]] = param[1];
    }
    let { filters: filtersStr, sortId, highToLow } = query;
    let filters: string[] = filtersStr?.split(",");
    console.log("---INITIAL", filters, sortId, highToLow, query);

    let selectedFilters: number[] = filters?.map(
            (contr) => filterConfig.find(
                (c) => c.value && c.value.toLowerCase() === contr.toLowerCase()
            )?.index
        )
        || [];
    let selectedSorting = { callId: sortId, highToLow };

    const removeSelected = (item) => {
        const index = selectedFilters.indexOf(item);
        if (index !== -1) {
            selectedFilters.splice(index, 1);
            selectedFilters = selectedFilters;
        }
    }

    const changeQuery = () => {
        if ('URLSearchParams' in window) {
            const searchParams = new URLSearchParams(window.location.search)
            console.log("---SETTING", selectedFilters, selectedSorting)
            if (selectedFilters && selectedFilters.length > 0) {
                searchParams.set("filters", selectedFilters.map((index) => filterConfig[index].value) as any);
            }
            if (selectedSorting?.callId) {
                searchParams.set("sortId", selectedSorting?.callId);
            }
            if (selectedSorting?.highToLow) {
                searchParams.set("highToLow", selectedSorting?.highToLow);
            }
            const newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
            history.pushState(null, '', newRelativePathQuery);
        }
    }

    function onFiltersChanged(index) {
        if (index === 0) {
            // ALL
            selectedFilters = [];
        } else {
            if (selectedFilters.includes(index)) {
                removeSelected(index);
            } else {
                selectedFilters = [...selectedFilters, index];
            }
        }

        console.log("Selection changed", selectedFilters);

        changeQuery();
        dispatch('categoriesSelected', {
            contracts: selectedFilters.map((index) => filterConfig[index].value)
        });
    }

    function onSortChanged() {
        console.log(" +++++++ SORTING CHANGED +++++++ ", selectedSorting);

        changeQuery();
        dispatch('sortingChanged', {
            sortBy: selectedSorting.callId,
            highToLow: selectedSorting.highToLow,
        });
    }

    function ren() {
        console.log("WHY====")
    }

    $: selectedFilters;
    $: ren();
</script>

<div class="row row--grid">
    <div class="col-12">
        <div class="main__filter">
            <!-- tabs nav -->
            <ul class="nav nav-tabs main__tabs" id="main__tabs" role="tablist">

                {#each filterConfig as filter, i}
                    <li class="nav-item" on:click={filter.onClick} style="cursor: pointer">
                        <a class={`nav-link ${selectedFilters.indexOf(i) > -1 ? "active": ""}`}
                           aria-controls={"tab-" + i + 1}
                           aria-selected={selectedFilters.includes(i)}>
                            {filter.text}
                        </a>
                    </li>
                {/each}
            </ul>
            <!-- end tabs nav -->
            <div style="display: flex;flex-direction: row;justify-content: space-evenly">
                <select name="sorting" bind:value={selectedSorting} on:change={onSortChanged}
                        class="dropdown-menu"
                >
                    {#each sortingConfig as sorting}
                        <option value={sorting}>
                            {sorting.text}
                        </option>
                    {/each}
                </select>

            </div>
        </div>
    </div>
</div>

<style>
    #main__tabs {
        margin-top: 0;
    }

    .filter-wrap {
        margin-top: 20px;
        height: 100%;
    }

    .filter-wrap__btn {
        width: 100%;
        height: 50px;
        border-radius: 12px;
        background-color: #222227;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: 14px;
        position: relative;
        z-index: 2;
        text-transform: uppercase;
        font-family: 'Inter', sans-serif;
        font-weight: 500;
    }

    .filter-wrap__btn:hover {
        color: #fff;
        background-color: #222227;
    }

    @media (min-width: 768px) {
        .filter-wrap {
            margin-top: 30px;
        }
    }

    @media (min-width: 1200px) {
        .filter-wrap {
            margin-top: 0;
        }

        .filter-wrap__btn {
            display: none;
        }

        .filter-wrap__content {
            display: block !important;
            position: relative;
            height: 100%;
        }
    }

    .filter {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        margin-top: 20px;
    }

    .filter__title {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        height: auto;
        width: 100%;
        color: #fff;
        font-size: 16px;
        font-weight: 400;
        margin-bottom: 25px;
    }

    .filter__title button {
        font-size: 12px;
        font-weight: 400;
        color: #AC1E21;
    }

    .filter__title button:hover {
        color: #eb5757;
    }

    .filter__group {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        width: 100%;
        margin-bottom: 20px;
        position: relative;
    }

    .filter__group:last-child {
        margin-bottom: 0;
    }

    .filter__label {
        line-height: 100%;
        font-weight: 400;
        font-size: 14px;
        color: #bdbdbd;
        margin-bottom: 15px;
        font-family: 'Inter', sans-serif;
    }

    .filter__label b {
        font-weight: 500;
        color: #fff;
    }

    .filter__select-wrap {
        position: relative;
        width: 100%;
    }

    .filter__select {
        background: url("img/arrow2.svg") no-repeat center right 20px #222227;
        background-size: 18px auto;
        border: 1px solid transparent;
        border-radius: 12px;
        height: 46px;
        position: relative;
        color: #fff;
        font-size: 14px;
        width: 100%;
        padding: 0 20px;
        cursor: pointer;
        font-family: 'Inter', sans-serif;
    }

    .filter__select:focus {
        border-color: #AC1E21;
    }

    .filter__input {
        background-color: #222227;
        border: 1px solid transparent;
        border-radius: 12px;
        height: 46px;
        position: relative;
        color: #fff;
        font-size: 14px;
        width: 100%;
        padding: 0 20px;
        font-family: 'Inter', sans-serif;
    }

    .filter__input:focus {
        border-color: #AC1E21;
    }

    .filter__checkboxes {
        position: relative;
        margin-top: 5px;
    }

    .filter__checkboxes:first-child {
        margin-top: 0;
    }

    .filter__checkboxes li {
        position: relative;
        margin-bottom: 15px;
    }

    .filter__checkboxes li:last-child {
        margin-bottom: 0;
    }

    .filter__checkboxes input:not(:checked),
    .filter__checkboxes input:checked {
        position: absolute;
        left: -9999px;
    }

    .filter__checkboxes input:not(:checked) + label,
    .filter__checkboxes input:checked + label {
        font-size: 14px;
        font-weight: 400;
        position: relative;
        cursor: pointer;
        padding-left: 36px;
        line-height: 24px;
        font-family: 'Inter', sans-serif;
        margin: 0;
        transition: color 0.5s ease;
    }

    .filter__checkboxes input:not(:checked) + label a,
    .filter__checkboxes input:checked + label a {
        color: #AC1E21;
    }

    .filter__checkboxes input:not(:checked) + label a:hover,
    .filter__checkboxes input:checked + label a:hover {
        color: #AC1E21;
        text-decoration: underline;
    }

    .filter__checkboxes input:not(:checked) + label {
        color: #bdbdbd;
    }

    .filter__checkboxes input:checked + label {
        color: #fff;
    }

    .filter__checkboxes input:not(:checked) + label:before,
    .filter__checkboxes input:checked + label:before {
        content: '';
        position: absolute;
        display: block;
        left: 0;
        top: 0;
        width: 24px;
        height: 24px;
        background-color: #222227;
        border-radius: 8px;
    }

    .filter__checkboxes input:not(:checked) + label:after,
    .filter__checkboxes input:checked + label:after {
        content: '';
        position: absolute;
        display: block;
        left: 0;
        top: 0;
        width: 24px;
        height: 24px;
        transition: 0.5s ease;
        background-color: #AC1E21;
        border-radius: 10px;
        border: 6px solid #222227;
    }

    .filter__checkboxes input:not(:checked) + label:after {
        opacity: 0;
        transform: scale(0);
    }

    .filter__checkboxes input:checked + label:after {
        opacity: 1;
        transform: scale(1);
    }

    .filter__checkboxes label::-moz-selection {
        background: transparent;
        color: #bdbdbd;
    }

    .filter__checkboxes label::selection {
        background: transparent;
        color: #bdbdbd;
    }

    .filter__btn {
        width: 100%;
        height: 50px;
        border-radius: 12px;
        background-color: #AC1E21;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: 14px;
        position: relative;
        z-index: 2;
        text-transform: uppercase;
        font-family: 'Inter', sans-serif;
        font-weight: 500;
    }

    .filter__btn:hover {
        color: #AC1E21;
        background-color: #222227;
    }

    @media (min-width: 1200px) {
        .filter {
            margin-top: 30px;
            padding-left: 10px;
        }

        .filter--sticky {
            position: -webkit-sticky;
            position: sticky;
            top: 100px;
            margin-bottom: 120px;
        }
    }

    .sellers-list {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        flex-wrap: wrap;
    }

    .sellers-list li {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        margin-top: 20px;
    }

    .sellers-list__number {
        display: inline-flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        padding-right: 15px;
        color: #bdbdbd;
        font-size: 14px;
    }

    .sellers-list__author {
        display: inline-flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        width: calc(100% - 40px);
        position: relative;
        height: 60px;
        padding-left: 75px;
    }

    .sellers-list__author--verified:after {
        content: '';
        position: absolute;
        display: block;
        width: 20px;
        height: 20px;
        border: 2px solid #fff;
        bottom: -2px;
        left: 42px;
        border-radius: 50%;
        background: url("img/verified.svg") no-repeat center #2f80ed;
        background-size: 14px auto;
        z-index: 1;
        pointer-events: none;
    }

    .sellers-list__author img {
        position: absolute;
        top: 0;
        left: 0;
        display: block;
        overflow: hidden;
        width: 60px !important;
        height: 60px;
        border-radius: 16px;
    }

    .sellers-list__author a {
        font-family: 'Inter', sans-serif;
        font-weight: 500;
        color: #fff;
        font-size: 16px;
        margin-bottom: 5px;
    }

    .sellers-list__author a:hover {
        color: #AC1E21;
    }

    .sellers-list__author span {
        color: #bdbdbd;
        font-size: 14px;
        font-weight: 400;
    }

    .dropdown-menu {
        position: relative;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;

        padding: 10px 10px 10px 0;
        /*font-size: 18px;*/
        border-radius: 0;
        border: none;
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
        color: white;
        cursor: pointer;
        background: url(/img/sort-down.svg) 96% / 15% no-repeat transparent;
        width: 150px;
    }

    .dropdown-menu option {
        padding: 0 0;
        font-size: 14px;
        font-family: 'Inter', sans-serif;
        font-weight: 400;
        color: black;
        height: 36px;
        line-height: 36px;
        transition: 0.5s ease;
    }

    /* active state */
    .select-text:focus ~ .select-label, .select-text:valid ~ .select-label {
        color: #2F80ED;
        top: -20px;
        transition: 0.2s ease all;
        font-size: 14px;
    }

    /* active state */
    .select-text:focus ~ .select-bar:before, .select-text:focus ~ .select-bar:after {
        width: 50%;
    }

    @media (min-width: 576px) {
        .sellers-list {
            height: 640px;
        }

        .sellers-list li {
            width: 50%;
        }
    }

    @media (min-width: 768px) {
        .sellers-list {
            height: 450px;
        }

        .sellers-list li {
            width: 33%;
            margin-top: 30px;
        }
    }

    @media (min-width: 1200px) {
        .sellers-list {
            height: 300px;
        }

        .sellers-list li {
            width: 20%;
            margin-top: 40px;
        }
    }

    @media (max-width: 1000px) {
        .main__filter {
            height: 90px;
        }

        .main__filter > ul {
            height: 100%;
            margin-top: 10px !important;
        }
    }

    @media (max-width: 768px) {
        .main__filter {
            height: inherit;
        }

        .main__filter > ul {
            height: auto;
        }
    }
</style>
