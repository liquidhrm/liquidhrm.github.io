function init() {
    console.log("inint start");
    console.log(web3);

    initView();
    initWeb3();

    console.log(web3);
    console.log("init end");
}

function initView() {                                                               // Sort of model/view data separation :)
    // Fetch network options
    var infuraApiKey = "TzVLrjipI5naqtX23CCG";                                      // Key should be fetched but now leave it here for simplicity

    $('#networkComboBox').append($('<option>', {value: "https://mainnet.infura.io/" + infuraApiKey, text:'Mainnet'}));
    $('#networkComboBox').append($('<option>', {value: "https://ropsten.infura.io/" + infuraApiKey, text:'Ropsten'}));

    $('#networkComboBox').val( "https://mainnet.infura.io/" + infuraApiKey );       // Set default value

    // Fetch example account address
    $("#accountAddressTextBox").val( "0xE46DA9c858C2fE4907bE5Bda60eC8310ca5dC684" );
}

function initWeb3() {
    web3 = new Web3(new Web3.providers.HttpProvider( $("#networkComboBox").val() ));
}

function executeQuery(event) {
    queryAccountBalance();

    showQueryDetails();

    queryBlockNumber();
    queryCurrentProvider();
    queryNodeVersion();
    queryNetworkVersion();
    queryApiVersion();
}

function resetQueryResultsAnimation() {
    // Reset animations (remove animation class)
    $("#accountBalanceResult").removeClass( "fadeIn" );
    $("#blockNumberResult").removeClass( "bounceInRight" );
    $("#currentProviderResult").removeClass( "bounceInRight" );
    $("#nodeVersionResult").removeClass( "bounceInRight" );
    $("#networkVersionResult").removeClass( "bounceInRight" );
    $("#apiVersionResult").removeClass( "bounceInRight" );
}

function showQueryDetails() {
    // Set query result DIV visible (it is hidden after startup)
    if( $("#queryDetails").hasClass("hiddenn") ) {
        $("#queryDetails").removeClass( "hiddenn" ).addClass( "visiblee fadeIn" )
    }
}

function queryAccountBalance() {
    var getBalancePromise = $.when( getBalance() );                             // Wrap sync call into defered function using promise to get result data
   
    getBalancePromise.done( function(accountBalance) {
        $("#accountBalanceResult").text( accountBalance ).addClass( "fadeIn" );
    });
}

function getBalance() {
    var deferred = $.Deferred();
    
    var accountAddress = $("#accountAddressTextBox").val();

    var accountBalanceWei = web3.eth.getBalance( accountAddress ).toNumber();   // Deprecated main thread sync call
    var accountBalance = web3.fromWei( accountBalanceWei, 'ether' );

    if( accountBalance != null ) {
        deferred.resolve( accountBalance );
    } else {
        deferred.reject( "web3.eth.getBalance failed!" );
    }
    
    return deferred.promise();
}

function queryBlockNumber() {
    web3.eth.getBlockNumber(function (error, result) {
        if (!error) {
            console.log("web3.eth.getBlockNumber success");
            $("#blockNumberResult").html("current eth blockNumber: <mark>" + JSON.stringify(result) + "</mark>").addClass("bounceInRight");
        } else {
            console.error("web3.eth.getBlockNumber error! Reason:");
            console.error(error);
        }
    })
}

function queryCurrentProvider() {
    var result = web3.currentProvider;
    $("#currentProviderResult").html("current provider: <mark>" + JSON.stringify(result) + "</mark>").addClass("bounceInRight");
}

function queryNodeVersion() {
    web3.version.getNode(function (error, result) {
        if (!error) {
            console.log("web3.version.getNode success");
            $("#nodeVersionResult").html("node version: <mark>" + JSON.stringify(result) + "</mark>").addClass("bounceInRight");
        } else {
            console.error("web3.version.getNode error! Reason:");
            console.error(error);
        }
    })
}

function queryNetworkVersion() {
    web3.version.getNetwork(function (error, result) {
        if (!error) {
            console.log("web3.version.getNetwork success");
            $("#networkVersionResult").html("network version: <mark>" + JSON.stringify(result) + "</mark>").addClass("bounceInRight");
        } else {
            console.error("web3.version.getNetwork error! Reason:");
            console.error(error);
        }
    })
}

function queryApiVersion() {
    var result = web3.version.api;
    $("#apiVersionResult").html("api version: <mark>" + JSON.stringify(result) + "</mark>").addClass("bounceInRight");
}
