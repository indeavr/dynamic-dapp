<script>

</script>

    <div class="box-placeholder" >
        <div class="image">
            <div class="embed-responsive embed-responsive-16by9"></div>
        </div>
        <div class="p-4">
            <span class="category text link"></span>
            <h4 class="text line"></h4>
            <h4 class="text"></h4>
        </div>
        <hr>

        <div class="excerpt p-4">
            <div class="text line"></div>
            <div class="text line"></div>
            <div class="text"></div>
        </div>
    </div>

<style>
    .box, .box-placeholder {
        background-color: #222227;
        /*background-color: #bdbdbd;*/
        box-shadow: 0 2px 3px 0 rgba(0, 0, 0, .1);
        vertical-align: top;
        height: 420px;
        border-radius: 20px;
    }
    .box hr, .box-placeholder hr {
        margin: 0;
        border-color: #bdbdbd;
    }
    .box {
        display: none;
    }
    .box .category {
        display: block;
        margin-bottom: 10px;
    }
    .box img {
        max-width: 100%;
    }
    .box-placeholder {
        font-size: 0;
        line-height: 0;
    }
    .box-placeholder .text {
        display: inline-block;
        background-color: #bdbdbd;
        height: 12px;
        border-radius: 100px;
        margin: 5px 0;
        min-width: 100px;
        opacity: 0.1;
        animation: fading 1.5s infinite;
    }
    .box-placeholder .text:first-child {
        margin-top: 0;
    }
    .box-placeholder .text:last-child {
        margin-bottom: 0;
    }
    .box-placeholder .text.link {
        background-color: indianred;
        opacity: 0.4;
    }
    .box-placeholder .text.line {
        width: 100%;
    }
    .box-placeholder .text.category {
        width: 100px;
        margin-bottom: 10px;
    }
    .box-placeholder h4.text {
        height: 20px;
        margin: 3px 0;
        opacity: 0.2;
    }
    .box-placeholder .image {
        background-color: #222227;
        /*background-color: #bdbdbd;*/
        height: 200px;
        border-radius: 20px;
    }
    @keyframes fading {
        0% {
            opacity: 0.1;
        }
        50% {
            opacity: 0.2;
        }
        100% {
            opacity: 0.1;
        }
    }

</style>
