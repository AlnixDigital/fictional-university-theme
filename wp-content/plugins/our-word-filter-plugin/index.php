<?php
/* 
    Plugin Name: Word Filter Plugin
    Description: Replaces a list of words.
    Version: 1.0
    Author: Alejo Silva
    Author URI: https://alejosilvalau.netlify.app/
*/

if (!defined('ABSPATH')) exit; // Exit if accessed directly

class OurWordFilterPlugin
{
    function __construct()
    {
        add_action('admin_menu', array($this, 'ourMenu'));
    }

    function ourMenu()
    {
        add_menu_page('Words To Filter', 'Word Filter', 'manage_options', 'ourwordfilter', array($this, 'wordFilterPage'), 'dashicons-smiley', 100);
    }

    function wordFilterPage()
    {
    }
}

$ourWordFilterPlugin = new OurWordFilterPlugin();
