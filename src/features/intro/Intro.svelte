<script>
    import {
        Page,
        appStore,
    } from './../@common'
    
    import { goto, prefetch } from '@sapper/app'
    import { onMount, afterUpdate } from 'svelte';
    
    import Button, {Label, Icon} from '@smui/button';    
    import Menu from '@smui/menu';
    import List, {Item} from '@smui/list';
    import Card, {Content, PrimaryAction, Media} from '@smui/card';
    import Chip, {Set} from '@smui/chips';
    import Snackbar, {Actions} from '@smui/snackbar';
    import Dialog, {Title, InitialFocus} from '@smui/dialog';
    import IconButton from '@smui/icon-button';

    import { ThemeNames } from '../../utils/themeNames'
    import { RouteAccount } from '../../utils/routes'    
    import { getBVAData } from '../../utils/getBVAData'
    import { account$ } from '../../features/@common/accountStore'

    import sha256 from 'js-sha256'

    const { theme$ } = appStore

    $: dark = $theme$ === ThemeNames.Default

    let assetData;
    let imageIndexes = [];
    var sourcesHashes = [];

    let menu;
    let slideIndex = 0;
    
    let dynSnackbar;
    let dynText;

    let simpleDialog;
    let dialogTitle;
    let dialogText;

    let showFileInput = false;
    
    let currentAlias = "";

    let files;
    $: {
        if (files && files[0]) {
            checkHash(files, sourcesHashes);
        }
    }

    onMount(async () => {
        currentAlias = location.search.substr(1);
        loadAssetData();
    })
    afterUpdate(() => {
	});

    const openUrl = url => () => {
        window.open(url, '_blank')
    }

    function handleClick() {
        goto(RouteAccount())
    }

    const prefetchRoute = () => {
        prefetch(RouteAccount())
    }

    function aliasUpdate() {
        loadAssetData();
    }

    function init() {
        assetData = undefined;
        imageIndexes = [];
        sourcesHashes = [];

        menu = undefined;
        slideIndex = 0;
        
        dynSnackbar = undefined;
        dynText = undefined;

        simpleDialog = undefined;
        dialogTitle = undefined;
        dialogText = undefined;

        showFileInput = false;
    }

    async function loadAssetData() { // load all asset data
        init();        
        console.log("loading " + currentAlias);
        if (currentAlias.length > 0)
        {
            goto('?' + currentAlias);

            try{
                assetData = await getBVAData(currentAlias);
            }
            catch(error){
                console.log(error);
            }
            if (assetData)
            {
                for (let i = 0; i < assetData["sources"].length; i++) {
                    if (assetData["sources"][i]["type"] == "img")
                        imageIndexes.push(i);
                    if (assetData["sources"][i]["hash"])
                        sourcesHashes.push(assetData["sources"][i]["hash"]);
                    else sourcesHashes.push(""); // "" bcz needs to match index
                }
            }
            //console.log(assetData);
        }
        else goto('/');
    }
    function handleDragDrop(e) {
        e.stopPropagation();
        e.preventDefault();
        const fileList = e.dataTransfer.files;
        checkHash(fileList, sourcesHashes);
    }
    function handleDragover(event) {
        //console.log("onDragOver");
    }

    function checkHash(fileList, sourcesHashes)
    {        
        if (fileList.length > 0)
        {
            const reader = new FileReader();
            reader.addEventListener('load', (event) => {
                var filehash = sha256(event.target.result);
                var idx = sourcesHashes.indexOf(filehash);
                
                if (idx >= 0)
                {
                    dialogTitle = "Verification Success";
                    dialogText = "File matches the hash for " + assetData["sources"][idx]["name"];
                }
                else {
                    dialogTitle = "Verification Failed";
                    dialogText = "File is not recognized as verified asset";
                }
                simpleDialog.open();                
            });            
        /*	reader.addEventListener('progress', (event) => {
                if (event.loaded && event.total) {
                    const percent = (event.loaded / event.total) * 100;
                    console.log(`Progress: ${Math.round(percent)}`);
                }
            });*/
            
            reader.readAsArrayBuffer(fileList[0]);
        }
    }
</script>


{#if assetData == undefined}
    <Page>
        <table>
            <thead>
            <tr>
                <th width="40%">
                    <section class="header">
                        <img src="{(dark ? 'img/BVA-logo.black.svg' : 'img/BVA-logo.white.svg')}" alt="Burst Verified Assets">
                        <p class="slogan">Decentralized ownership</p>
                    </section>
                </th>
                <th width="60%">
                    <section class="general">
                        <p class="description">Discover unique tokenized assets, verified on the Burst platform.</p>
                        <form on:submit|preventDefault={e => aliasUpdate()}>
                            <input class="general" bind:value={currentAlias} placeholder="enter an asset alias" required>
                            <button type="submit">Go!!!</button>
                        </form>
                        <br>
                        <p class="description">Create or import a Burstcoin wallet here to hold ownership of assets.</p>
                        {#if !$account$.accountId.length}
                            <Button on:mouseenter={prefetchRoute} on:click={handleClick} color="secondary" variant="raised" style="padding: 10; min-width: 36px; width: 100%;"><Icon class="material-icons">login</Icon><Label>My account</Label></Button>
                        {/if}
                        <p class="getburst">Burstcoin is a cryptocurrency that can be obtained from the token seller (if available), an exchange or from a Burstcoin faucet.</p>
                    </section>
                </th>
            </tr>
            </thead>
        </table>
    </Page>
{/if}

{#if assetData && assetData["name"]}
    <Page>
        <div class="dropzone" on:drop|preventDefault={handleDragDrop} on:dragover|preventDefault={handleDragover}>
            <table width="100%">
                <thead>
                    <tr>
                        <th width="10%"></th>
                        <th>
                            <p class="mdc-typography--headline4" style="margin: 10; text-align: center; font-weight: bold;">{assetData ? assetData["name"]:"Loading..."}</p>
                        </th>
                        <th align="right" width="10%">
                            <IconButton class="material-icons" on:click={() => { currentAlias = ""; init(); goto('/');}}>cancel</IconButton>
                        </th>
                    </tr>
                </thead>
            </table>            
            <table>
                <thead>
                    <tr style="vertical-align: top">
                        <th width="60%">
                            <section class="previews">                
                                <div class="container">
                                    {#if assetData && assetData["sources"]}
                                        {#if slideIndex < imageIndexes.length}
                                            <div>                                                                    
                                                <Card style="width: 100%;">
                                                    <PrimaryAction on:click={openUrl(assetData["sources"][imageIndexes[slideIndex]]["url"])}>
                                                        <h2 class="mdc-typography--subtitle1" style="margin: 10; text-align: center;">{assetData["sources"][imageIndexes[slideIndex]]["name"]}</h2>
                                                        {#if assetData["sources"][imageIndexes[slideIndex]]["type"] === "img"}
                                                            <Media aspectRatio="16x9" style="background-image: url({assetData["sources"][imageIndexes[slideIndex]]["url"]}); padding-top: 20%; background-size: contain;"></Media>
                                                        {/if}
                                                        <Content class="mdc-typography--body2">
                                                            {#if slideIndex < imageIndexes.length}
                                                                <div class="mdc-typography--headline8">{(slideIndex % imageIndexes.length) + 1} / {imageIndexes.length}</div>
                                                            {/if}
                                                        </Content>
                                                    </PrimaryAction>
                                                </Card>
                                            </div>                        
                                            {#if slideIndex >= 0}
                                                <!-- svelte-ignore a11y-missing-attribute -->
                                                <a class="prev" on:click={() => slideIndex = (slideIndex - 1 < 0) ? imageIndexes.length - 1 : slideIndex - 1}>❮</a>                               
                                            {/if}
                                            {#if slideIndex < imageIndexes.length}
                                                <!-- svelte-ignore a11y-missing-attribute -->
                                                <a class="next" on:click={() => slideIndex = ((slideIndex + 1) % imageIndexes.length)}>❯</a>
                                            {/if}
                                        {/if}
                                    {/if}
                                </div>
                            </section>
                        </th>
                        <th width="40%">
                            <section class="general">                    
                                <p class="mdc-typography--body1">{assetData ? assetData["description"]:""}</p>
                                {#if assetData && assetData["tags"]}
                                    <div>
                                        <Set chips={assetData["tags"]} let:chip>
                                            <Chip shouldRemoveOnTrailingIconClick={false}>
                                                {chip}
                                            </Chip>
                                        </Set>
                                    </div>
                                {/if}
                            </section>
                            <br>
                            <section class="downloadlinks">
                                {#if assetData}
                                    <div>
                                        <Button on:click={() => menu.setOpen(true)} color="secondary" variant="raised" style="padding: 10; min-width: 36px; width: 100%;"><Icon class="material-icons" align="left">get_app</Icon><Label align="right">Download</Label><Icon class="material-icons" style="margin: 0;">arrow_drop_down</Icon></Button>
                                        <Menu bind:this={menu} anchorCorner="BOTTOM_LEFT">
                                            <List>
                                                {#if assetData && assetData["sources"]}
                                                    {#each assetData["sources"] as element, i (element)}
                                                        {#if element && element["url"]}
                                                            <Item on:SMUI:action={openUrl(element["url"])}>
                                                                {#if element && element["type"] === "bin"}<Icon class="material-icons">insert_drive_file</Icon>{/if}
                                                                {#if element && element["type"] === "img"}<Icon class="material-icons">crop_original</Icon>{/if}
                                                                {#if element && element["type"] === "web"}<Icon class="material-icons">link</Icon>{/if}                                        
                                                                <Label>{element["name"]}</Label>
                                                            </Item>
                                                        {/if}
                                                    {/each}
                                                {/if}
                                            </List>
                                        </Menu>
                                    </div>
                                {/if}
                                {#if showFileInput == true}
                                    <br><input type="file" bind:files>
                                {/if}
                                {#if assetData && assetData["contact_url"]}
                                    <div style="margin: 10;">
                                        <br>
                                        <Button on:click={openUrl(assetData["contact_url"])} color="secondary" variant="raised" style="padding: 10; min-width: 36px; width: 100%;"><Icon class="material-icons">contact_support</Icon><Label>Contact</Label></Button>
                                    </div>
                                {/if}                    
                                {#if assetData && !$account$.accountId.length}
                                    <br>
                                    <p class="noaccount">Login or create an account to buy and trade this asset.</p>
                                    <div style="margin: 10;">                                        
                                        <Button on:mouseenter={prefetchRoute} on:click={handleClick} color="secondary" variant="raised" style="padding: 10; min-width: 36px; width: 100%;"><Icon class="material-icons">login</Icon><Label>My account</Label></Button>
                                    </div>
                                {/if}
                                {#if $account$.accountId.length && assetData && assetData["buy_url"]} <!-- only show the direct buy link if the user has an account. because the account id needs to be known to send the asset to -->
                                    <div style="margin: 10;">
                                        <br>
                                        <!-- TODO add .replace("$publicKey$", $account$.publicKey) so we can send the full pub key -->
                                        <Button on:click={openUrl(assetData["buy_url"].replace("$accountId$", $account$.accountId))} color="secondary" variant="raised" style="padding: 10; min-width: 36px; width: 100%;"><Icon class="material-icons">payments</Icon><Label>Buy direct</Label></Button>
                                    </div>
                                {/if}
                            </section>
                        </th>
                    </tr>
                </thead>
            </table>
            {#if assetData}                
                <p class="instruction"><Icon class="material-icons" style="padding-right: 10px;">highlight_alt</Icon>Drop your downloaded asset files on this page to verify them.</p>
            {/if}
            <p class="disclaimer">This website is provided as free service. We hold no responsibility to the data being retrieved from the blockchain.</p>
        </div>
        <Snackbar bind:this={dynSnackbar} labelText={dynText}>
            <Label></Label>
        </Snackbar>
    </Page>

    <Dialog bind:this={simpleDialog} aria-labelledby="simple-title" aria-describedby="simple-content">
        <!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
        <Title id="simple-title">{dialogTitle}</Title>
        <Content id="simple-content">
            {dialogText}
        </Content>
        <Actions>
            <Button on:click={() => {simpleDialog.close()}}>
                <Label>Okay</Label>
            </Button>
        </Actions>
    </Dialog>
{/if}

<style>
        * {
        box-sizing: border-box;
    }
    :root {
        font-family: Roboto, sans-serif;
    }
    .downloadlinks {
        margin: 0 auto;
        width: 80%;
        text-align: left;
        align-items: normal;
        align-content: center;
    }

    .previews {
        margin: 10 auto;      
        text-align: left;
    }

    .general {
        margin: 0 auto;
        width: 80%;
        text-align: left;
        vertical-align: top;
    }

    .noaccount {
        display: flex;
        justify-content: left;
        font-size: smaller;
    }

    .disclaimer {
        display: flex;
        justify-content: center;
        font-size: x-small;
    }

    .instruction {
        display: flex;
        justify-content: center;
        font-size: small;
    }

    .container {
        position: relative;
    }

    .prev,
    .next {
        cursor: pointer;
        position: absolute;
        top: 0%;
        height: 100%;
        width: auto;
        padding: 25px;
        margin-top: 0px;
        color: rgba(255, 255, 255, 0.466);
        font-weight: bold;
        font-size: 40px;
        border-radius: 3px 3px 3px 3px;
        user-select: none;
        -webkit-user-select: none;
        text-align: center;
        align-content: center;
        /*vertical-align: middle;*/
    }
    /* Position the "next button" to the right */
    .next {
        right: 0;
    }
    .prev:hover,
    .next:hover {
        color: rgb(71, 71, 71);
        background-color: rgba(255, 255, 255, 0.777);
    }


    .header {
        text-align: center;
        margin-bottom: 1rem;
    }

    .header img {
        height: 80%;
        width: 80%;
        text-align: center;
    }

    .general {
        margin: 0 auto;
        width: 80%;
        text-align: left;
    }

    .general .description {
        display: flex;
        justify-content: left;
    }

    .general .getburst {
        display: flex;
        justify-content: left;
        font-size: smaller;
    }

    @media (max-width: 480px) {
        .general {
            width: 100%;
        }
    }
</style>
