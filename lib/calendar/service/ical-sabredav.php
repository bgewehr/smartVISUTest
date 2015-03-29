<?php
/**
  * Achtung! class.iCalReader.php kann nur Wiederholungen mit ENDEDATUM, nicht mit der Anzahl!!!
  * jsaemann@firewire.franken.de
  */

require_once '../../../lib/includes.php';
require_once const_path_system.'calendar/calendar.php';
require_once 'Sabre/VObject/includes.php';

class calendar_yoshi_ical extends calendar
{
	public function init($request) {
		parent::init($request);
	}

	public function run() {
		$icsdatei   = Sabre_VObject_Reader::read(file_get_contents("$this->url"));
		$icsevents = $icsdatei->vevent;
		$this->debug($icsevents);

		if ($icsevents !== false)
		{
			$eventid = 0;
			foreach ($icsevents as $icsevent)
			{
				if ($eventid < $this->count) {
					$startstamp = strtotime($icsevent->dtstart);
					$endstamp = strtotime($icsevent->dtend);

					// only export entries in the future
					if ( $endstamp > date('U')) { 
						$this->data[$eventid] = array('pos' => $eventid,
							'start' => date('y-m-d', $startstamp).' '.date('H:i:s', $startstamp),
							'end' => date('y-m-d', $endstamp).' '.date('H:i:s', $endstamp),
							'title' => stripslashes(($icsevent->summary)),
							'where' => stripslashes(($icsevent->location)),
						);
						switch ($icsevent->summary) {
							case "Graue Tonne":
								$this->data[$eventid][icon] = "icons/ws/message_garbage.png";
								$this->data[$eventid][color] = "#555555";
							break;
							case "Braune Tonne":
								$this->data[$eventid][icon] = "icons/ws/message_garbage.png";
								$this->data[$eventid][color] = "#804000";
							break;
							case "Blaue Tonne":
								$this->data[$eventid][icon] = "icons/ws/message_garbage.png";
								$this->data[$eventid][color] = "#004080";
							break;
							case "Gelbe Tonne":
								$this->data[$eventid][icon] = "icons/ws/message_garbage.png";
								$this->data[$eventid][color] = "#ffff00";
							break;
							default:
								if (strpos($icsevent->description,'§') !== false) {
									$treffer = explode('§', $icsevent->description);
									foreach($treffer as $versenkt) {
										$felder = explode(' ', trim($versenkt, ' \n'));
										if (!empty($felder['1'])) {
											$this->data[$eventid][$felder['0']] = stripslashes($felder['1']);
										}
									}
								} else {
									$this->data[$eventid]['content'] = $icsevent->description;
								}
							break;
						}
						$eventid++;
					}
				}
			}
		} else {
			$this->error('Calendar: ICAL', 'Calendar read request failed!');
		}
	}
}

$service = new calendar_yoshi_ical(array_merge($_GET, $_POST));
echo $service->json();
?>
