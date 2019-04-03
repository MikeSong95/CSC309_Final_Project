const data = ['{{data}}'];
$(document).ready(function() {
    $('.name').append(<%- JSON.stringify(data.name) %>);
});