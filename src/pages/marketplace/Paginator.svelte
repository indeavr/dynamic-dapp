<script>
    import { createEventDispatcher } from "svelte";

    export let totalPages = 1;
    export let activePage = 1;

    console.log("<Page changed", totalPages, activePage)
    const dispatch = createEventDispatcher();

    const changeQuery = () => {
        if ('URLSearchParams' in window) {
            const searchParams = new URLSearchParams(window.location.search)
            searchParams.set("page", activePage);
            if (window.location.pathname) {

            }
            const newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
            history.pushState(null, '', newRelativePathQuery);
        }
    }

    const change = (newPage) => {
        activePage = newPage;

        console.log("newPage", newPage)
        changeQuery();
        dispatch('pageChanged', {
            page: newPage
        });
    }
    $: totalPages, console.log("<Page TOTAL", totalPages);
</script>

<div class="row row--grid">
    <div class="col-12">
        <div class="paginator">
            <span class="paginator__pages">{activePage} from {totalPages}</span>

            <ul class="paginator__list">
                <li on:click={() => change(activePage - 1)}>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M17,11H9.41l3.3-3.29a1,1,0,1,0-1.42-1.42l-5,5a1,1,0,0,0-.21.33,1,1,0,0,0,0,.76,1,1,0,0,0,.21.33l5,5a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42L9.41,13H17a1,1,0,0,0,0-2Z"/>
                        </svg>
                    </div>
                </li>
                <!--                <li class="active"><a href="#">1</a></li>-->
                {#each { length: totalPages } as _, i }
                    <li
                            class={+activePage === i + 1 ? "active": ""}
                            on:click={() => change(i + 1)}
                    >
                        <div>{i + 1}</div>
                    </li>
                {/each}

                <li on:click={() => change(activePage + 1)}>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M17.92,11.62a1,1,0,0,0-.21-.33l-5-5a1,1,0,0,0-1.42,1.42L14.59,11H7a1,1,0,0,0,0,2h7.59l-3.3,3.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l5-5a1,1,0,0,0,.21-.33A1,1,0,0,0,17.92,11.62Z"/>
                        </svg>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</div>

<style>
    .paginator {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        margin: 30px auto 0;
        width: 100%;
        height: 50px;
        border-radius: 16px;
        background-color: #16151a;
        border: 1px solid #222227;
    }

    .paginator__pages {
        display: none;
    }

    .paginator__list {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .paginator__list li {
        margin-right: 15px;
        cursor: pointer;
    }

    .paginator__list li:last-child {
        margin-right: 0;
    }

    .paginator__list li.active div {
        color: #AC1E21;
        cursor: default;
        font-weight: 500;
    }

    .paginator__list div {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 30px;
        height: 30px;
        border-radius: 10px;
        background-color: #222227;
        font-size: 14px;
        color: #bdbdbd;
        font-weight: 400;
        font-family: 'Inter', sans-serif;
    }

    .paginator__list div svg {
        width: 22px;
        height: auto;
        fill: #bdbdbd;
        transition: fill 0.5s ease;
    }

    .paginator__list div:hover {
        color: #AC1E21;
    }

    .paginator__list div:hover svg {
        fill: #AC1E21;
    }

    @media (min-width: 768px) {
        .paginator {
            padding: 0 20px;
            margin: 40px auto 0;
            height: 60px;
            justify-content: space-between;
        }

        .paginator__pages {
            display: block;
            font-size: 14px;
            color: #bdbdbd;
            font-weight: 400;
            font-family: 'Inter', sans-serif;
        }
    }
</style>
